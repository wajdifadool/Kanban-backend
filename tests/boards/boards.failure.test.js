const request = require('supertest')
const app = require('../../app')
const mongoose = require('mongoose')

const { registerAndLogin } = require('../testUtils')

describe('Boards - Failure Scenarios', () => {
  let user_1_token, user_2_token

  beforeEach(async () => {
    user_1_token = await registerAndLogin('admin@gmail.com')
    user_2_token = await registerAndLogin('user@gmail.com')
  })

  it('should not create board with out token', async () => {
    const res = await request(app)
      .post('/api/v1/boards')
      // .set('Authorization', `Bearer ${user_1_token}`)
      // .set('Authorization', `Bearer ${user_1_token}`)
      .send({ title: 'Main Boards' })
    // console.log(res.body)
    expect(res.statusCode).toBe(401)
    expect(res.body.success).toBe(false)
    // expect(res.body.data).not.toBeNull()
    // console.log(res.body.data)
  })

  it('should not allow accsess to private boards without authriztoin', async () => {
    const res = await request(app)
      .post('/api/v1/boards')
      .set('Authorization', `Bearer ${user_1_token}`)
      .send({ title: 'Main Boards' })

    expect(res.statusCode).toBe(201)
    expect(res.body.success).toBe(true)

    const board_id = res.body.data._id

    const res_2 = await request(app)
      .get(`/api/v1/boards/${board_id}`)
      .set('Authorization', `Bearer ${user_2_token}`)
    console.log(res_2.body)
    expect(res_2.statusCode).toBe(404)
  })

  it('should not allow adding a member that does not exist', async () => {
    const res = await request(app)
      .post('/api/v1/boards')
      .set('Authorization', `Bearer ${user_1_token}`)
      .send({ title: 'Main Boards' })

    expect(res.statusCode).toBe(201)
    expect(res.body.success).toBe(true)

    const board_id = res.body.data._id

    const board_res = await request(app)
      .post(`/api/v1/boards/${board_id}/members`)
      .set('Authorization', `Bearer ${user_1_token}`)
      .send({ memberId: new mongoose.Types.ObjectId().toString() }) // non-existent user

    expect(board_res.statusCode).toBe(400)
    expect(board_res.body.success).toBe(false)
  })

  it('should not allow removing the board owner', async () => {
    const user_1 = await request(app)
      .post('/api/v1/auth/me')
      .set('Authorization', `Bearer ${user_1_token}`)

    const res = await request(app)
      .post('/api/v1/boards')
      .set('Authorization', `Bearer ${user_1_token}`)
      .send({ title: 'Main Boards' })

    expect(res.statusCode).toBe(201)
    expect(res.body.success).toBe(true)

    const board_id = res.body.data._id

    const res_board = await request(app)
      .delete(`/api/v1/boards/${board_id}/members`)
      .set('Authorization', `Bearer ${user_1_token}`)
      .send({ memberId: user_1._id })

    expect(res_board.statusCode).toBe(400)
    expect(res_board.body.success).toBe(false)
  })
})
