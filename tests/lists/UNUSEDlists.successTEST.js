// const request = require('supertest')
// const app = require('../../app')
// const { registerAndLogin } = require('../testUtils')

// describe('Lists - Success Scenarios', () => {
//   let user1Token
//   let boardId

//   beforeEach(async () => {
//     // Register & login user
//     user1Token = await registerAndLogin('admin@gmail.com')

//     // Create a Board before each test (required for list creation)
//     const boardPayload = {
//       title: 'Board #1',
//       description: 'Test board description',
//     }

//     const boardRes = await request(app)
//       .post('/api/v1/boards')
//       .set('Authorization', `Bearer ${user1Token}`)
//       .send(boardPayload)

//     boardId = boardRes.body.data._id
//     expect(boardRes.statusCode).toBe(201)
//   })

//   it('should create a List inside a Board', async () => {
//     const listPayload = { title: 'List #1' }

//     const res = await request(app)
//       .post(`/api/v1/boards/${boardId}/lists`)
//       .set('Authorization', `Bearer ${user1Token}`)
//       .send(listPayload)

//     expect(res.statusCode).toBe(201)
//     expect(res.body.success).toBe(true)
//     expect(res.body.data.title).toBe(listPayload.title)
//   })

//   it('should retrieve all Lists for a Board', async () => {
//     // Create one list
//     await request(app)
//       .post(`/api/v1/boards/${boardId}/lists`)
//       .set('Authorization', `Bearer ${user1Token}`)
//       .send({ title: 'List #A' })

//     // Retrieve lists
//     const res = await request(app)
//       .get(`/api/v1/boards/${boardId}/lists`)
//       .set('Authorization', `Bearer ${user1Token}`)

//     expect(res.statusCode).toBe(200)
//     expect(res.body.success).toBe(true)
//     expect(Array.isArray(res.body.data)).toBe(true)
//     expect(res.body.data.length).toBeGreaterThan(0)
//   })

//   it('should update a List', async () => {
//     // Create list
//     const createRes = await request(app)
//       .post(`/api/v1/boards/${boardId}/lists`)
//       .set('Authorization', `Bearer ${user1Token}`)
//       .send({ title: 'Old List Title' })

//     const listId = createRes.body.data._id

//     // Update list
//     const updateRes = await request(app)
//       .put(`/api/v1/lists/${listId}`)
//       .set('Authorization', `Bearer ${user1Token}`)
//       .send({ title: 'Updated List Title' })

//     expect(updateRes.statusCode).toBe(200)
//     expect(updateRes.body.data.title).toBe('Updated List Title')
//   })

//   it('should delete a List', async () => {
//     const createRes = await request(app)
//       .post(`/api/v1/boards/${boardId}/lists`)
//       .set('Authorization', `Bearer ${user1Token}`)
//       .send({ title: 'Temp List' })

//     const listId = createRes.body.data._id

//     const deleteRes = await request(app)
//       .delete(`/api/v1/lists/${listId}`)
//       .set('Authorization', `Bearer ${user1Token}`)

//     expect(deleteRes.statusCode).toBe(200)
//     expect(deleteRes.body.success).toBe(true)
//   })
// })
