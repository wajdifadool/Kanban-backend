const request = require('supertest')
const app = require('../../app')
const User = require('../../models/user')

// Utility: create user and return { token, user }
const createUser = async (userDetails) => {
  const res = await request(app).post('/api/v1/auth/register').send(userDetails)
  return { token: res.body.token, user: res.body }
}

describe('Boards - Success Scenarios', () => {
  let owner, tokenOwner

  beforeEach(async () => {
    // Create owner
    const res = await createUser({
      name: 'Owner',
      email: 'owner@example.com',
      password: 'password123',
    })
    tokenOwner = res.token
    owner = await User.findOne({ email: 'owner@example.com' })
  })

  it('should create board', async () => {
    // Create a Board
    const res = await request(app)
      .post('/api/v1/boards') //TODO:change into Some FInals
      .set('Authorization', `Bearer ${tokenOwner}`)
      .send({ title: 'Main Boards' })

    // const board = res.body.data

    expect(res.statusCode).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data).not.toBeNull()

    // expect(res.body.data.owner).toBe("Something Here")
  })

  it('should update a board', async () => {
    // Add first

    const res = await request(app)
      .post('/api/v1/boards') //TODO:change into Some FInals
      .set('Authorization', `Bearer ${tokenOwner}`)
      .send({ title: 'Main Boards' })
    const id_board = res.body.data._id

    // console.log(res.body.data)
    const new_board_name = 'new board name'
    const res_board = await request(app)
      .put(`/api/v1/boards/${id_board}`)
      .set('Authorization', `Bearer ${tokenOwner}`)
      .send({ title: new_board_name })

    expect(res_board.statusCode).toBe(200)
    expect(res_board.body.success).toBe(true)
    expect(res_board.body.data.title).toBe(new_board_name)
  })

  it('should remove a board', async () => {
    // Add first

    const res = await request(app)
      .post('/api/v1/boards') //TODO:change into Some FInals
      .set('Authorization', `Bearer ${tokenOwner}`)
      .send({ title: 'Main Boards' })
    const id_board = res.body.data._id

    // console.log(res.body.data)

    const res_board = await request(app)
      .delete(`/api/v1/boards/${id_board}`)
      .set('Authorization', `Bearer ${tokenOwner}`)

    expect(res_board.statusCode).toBe(200)
    expect(res_board.body.success).toBe(true)
    // expect(res.body.data.collaborators).not.toContain(collab._id.toString())
  })
})
