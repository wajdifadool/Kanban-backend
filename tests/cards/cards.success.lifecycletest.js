const request = require('supertest')
const app = require('../../app')
const { registerAndLogin } = require('../testUtils')

describe('Cards full lifecycle', () => {
  let user1Token
  let boardId
  let listId
  let cardId
  let commnetId
  let checkListItemId

  let attachmentId

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

  it('should update the card', async () => {
    const res = await request(app)
      .put(`/api/v1/cards/${cardId}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ title: 'Updated Card Title' })

    expect(res.statusCode).toBe(200)
    expect(res.body.data.title).toBe('Updated Card Title')
  })

  it('should add a comments', async () => {
    const res = await request(app)
      .post(`/api/v1/cards/${cardId}/comments`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ text: 'Nice update!' })

    expect(res.statusCode).toBe(201)
    expect(res.body.data.text).toBe('Nice update!')

    commnetId = res.body.data._id
  })

  it('should get comments', async () => {
    const res = await request(app)
      .get(`/api/v1/cards/${cardId}/comments`)
      .set('Authorization', `Bearer ${user1Token}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.data).toHaveLength(1)
    expect(res.body.data[0].text).toBe('Nice update!')
  })

  it('should update a comment', async () => {
    const res = await request(app)
      .put(`/api/v1/cards/${cardId}/comments/${commnetId}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ text: 'New Text Updated!' })

    expect(res.statusCode).toBe(200)
    expect(res.body.data.text).toBe('New Text Updated!')
  })

  it('should delete a comment', async () => {
    const res = await request(app)
      .delete(`/api/v1/cards/${cardId}/comments/${commnetId}`)
      .set('Authorization', `Bearer ${user1Token}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.data).toEqual({})
  })
  it('should add check Listitem', async () => {
    const res = await request(app)
      .post(`/api/v1/cards/${cardId}/checklist`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        text: 'This is a check list item 1 ',
        isDone: false,
      })
    checkListItemId = res.body.data._id

    expect(res.statusCode).toBe(201)
    expect(res.body.data.text).toBe('This is a check list item 1 ')
    expect(res.body.data.isDone).toBe(false)
  })

  it('should gel all check List items', async () => {
    const res = await request(app)
      .get(`/api/v1/cards/${cardId}/checklist/`)
      .set('Authorization', `Bearer ${user1Token}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.data).toHaveLength(1)
  })

  it('should update check Listitem', async () => {
    const res = await request(app)
      .put(`/api/v1/cards/${cardId}/checklist/${checkListItemId}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        isDone: false,
      })
    expect(res.statusCode).toBe(200)
    expect(res.body.data.isDone).toBe(false)
  })

  it('should delte check Listitem', async () => {
    const res = await request(app)
      .delete(`/api/v1/cards/${cardId}/checklist/${checkListItemId}`)
      .set('Authorization', `Bearer ${user1Token}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.data).toEqual({}) // Expecting empty object as the data response
  })

  it('should gel all check List items second time', async () => {
    const res = await request(app)
      .get(`/api/v1/cards/${cardId}/checklist/`)
      .set('Authorization', `Bearer ${user1Token}`)

    expect(res.statusCode).toBe(200)

    expect(res.body.data).toHaveLength(0)
  })

  it('should duplicate the card', async () => {
    const res = await request(app)
      .post(`/api/v1/cards/${cardId}/duplicate`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ listId: listId }) // duplicate in the same list

    expect(res.statusCode).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toHaveProperty('_id') // Ensure duplicated card has an ID
    expect(res.body.data).toHaveProperty('title') // Assuming cards have a 'name' property
    expect(res.body.data.title).not.toBeNull() // Ensure the name is not null or empty
  })

  it('should delete the card successfully', async () => {
    const res = await request(app)
      .delete(`/api/v1/cards/${cardId}`)
      .set('Authorization', `Bearer ${user1Token}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toEqual({}) // Expecting empty object as the data response
  })

  // it('should attach a file', async () => {
  //   const res = await request(app)
  //     .post(`/api/v1/cards/${cardId}/attachments`)
  //     .set('Authorization', `Bearer ${user1Token}`)
  //     .attach('file', '__tests__/fixtures/test-image.png')

  //   expect(res.statusCode).toBe(201)
  // })
})
