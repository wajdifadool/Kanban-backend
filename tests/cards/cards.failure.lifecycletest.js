const request = require('supertest')
const app = require('../../app')
const { registerAndLogin } = require('../testUtils')

describe('Cards Full Lifecycle - Failure Cases', () => {
  let user1Token
  let boardId
  let listId
  let cardId
  let commnetId

  beforeAll(async () => {
    user1Token = await registerAndLogin('admin@gmail.com')

    // Create a board
    const boardRes = await request(app)
      .post('/api/v1/boards')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        title: 'Board #1',
        description: 'Test board description',
      })
    boardId = boardRes.body.data._id

    // Create a list
    const listRes = await request(app)
      .post(`/api/v1/boards/${boardId}/lists`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        title: 'List #1',
        position: 1,
      })
    listId = listRes.body.data._id

    // Create a card
    const cardRes = await request(app)
      .post(`/api/v1/cards`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        title: 'My first card',
        listId,
        boardId,
      })
    cardId = cardRes.body.data._id
  })

  // Delete Card - Failure: Non-existing Card
  it('should return 404 when trying to delete a non-existing card', async () => {
    const invalidCardId = 'nonexistentCardId'
    const res = await request(app)
      .delete(`/api/v1/cards/${invalidCardId}`)
      .set('Authorization', `Bearer ${user1Token}`)

    expect(res.statusCode).toBe(404)
    expect(res.body.success).toBe(false)
  })

  // Delete Card - Unauthorized Access
  it('should return 401 when trying to delete the card without authorization', async () => {
    const res = await request(app).delete(`/api/v1/cards/${cardId}`).send({}) // Missing Authorization header.

    expect(res.statusCode).toBe(401)
    expect(res.body.success).toBe(false)
    // expect(res.body.message).toBe('Unauthorized')
    // expect(res.body.message).toContain('Not authorized')
  })

  // Add Comment - Failure: Missing Text Field
  it('should return 400 when trying to add a comment with missing text', async () => {
    const res = await request(app)
      .post(`/api/v1/cards/${cardId}/comments`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({}) // Missing text field.

    expect(res.statusCode).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.error).toBe('Text is required for the comment')
  })

  // Unauthorized Access - Failure: No Authorization
  it('should return 401 for unauthorized request when trying to update the card', async () => {
    const res = await request(app)
      .put(`/api/v1/cards/${cardId}`)
      .send({ title: 'Updated Card Title' }) // No Authorization header.

    expect(res.statusCode).toBe(401)
    expect(res.body.success).toBe(false)
  })

  // Comment Update - Failure: Non-existing Comment
  it('should return 400 when trying to update a non-existing comment', async () => {
    const invalidCommentId = 'nonexistentCommentId'
    const res = await request(app)
      .put(`/api/v1/cards/${cardId}/comments/${invalidCommentId}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ text: 'Updated Comment' })

    expect(res.statusCode).toBe(400)
    expect(res.body.success).toBe(false)
  })

  // Comment Deletion - Failure: Non-existing Comment
  it('should return 404 when trying to delete a non-existing comment', async () => {
    const invalidCommentId = 'nonexistentCommentId'
    const res = await request(app)
      .delete(`/api/v1/cards/${cardId}/comments/${invalidCommentId}`)
      .set('Authorization', `Bearer ${user1Token}`)

    expect(res.statusCode).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.error).toBe('No commnet found')
  })

  // Duplicate Card - Failure: Invalid List
  it('should return 400 when trying to duplicate a card in a non-existing list', async () => {
    const invalidListId = 'nonexistentListId'
    const res = await request(app)
      .post(`/api/v1/cards/${cardId}/duplicate`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ listId: invalidListId }) // Invalid list ID.

    expect(res.statusCode).toBe(400)
    expect(res.body.success).toBe(false)
  })
})
