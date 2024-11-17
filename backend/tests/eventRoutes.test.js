const request = require('supertest');
const app = require('../index'); // Express 앱을 가져옴

describe('GET /api/events', () => {
  it('should return a list of events', async () => {
    const response = await request(app).get('/api/events');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
