const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/services/github');

describe('user testing', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('should redirect to the github oauth page on login', async () => {
    const res = await request(app).get('api/v1/github/login');
    expect(res.header.location).toMatch(
      /https:\/\/github.com\/login\/oauth\/authorize\?client_id=[\w\d]+&scope=user&redirect_uri=http:\/\/localhost:7890\/api\/v1\/github\/callback/i
    );
  });
  afterAll(() => {
    pool.end();
  });
});
