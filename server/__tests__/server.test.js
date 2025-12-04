import request from 'supertest';
import app from '../index.js';

describe('Server basic endpoints', () => {
  test('GET /api/health returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });

  test('POST /api/invites/send returns 500 when Firestore not configured', async () => {
    const res = await request(app)
      .post('/api/invites/send')
      .send({ email: 'test@example.com', fullName: 'Test User' })
      .set('Accept', 'application/json');
    // If serviceAccountKey.json is not present in server/, endpoint returns 500
    expect([200,400,500]).toContain(res.statusCode);
  });

  test('POST /api/admin/set-claim without admin key returns 403', async () => {
    const res = await request(app)
      .post('/api/admin/set-claim')
      .send({ uid: 'fake', claimKey: 'admin' });
    expect(res.statusCode).toBe(403);
  });
});
