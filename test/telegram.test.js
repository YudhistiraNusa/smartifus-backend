// File testing: backend/test/telegram.test.js
const request = require('supertest');
const app = require('../server');

describe('Telegram Alert System', () => {
    it('should send alert when weight below threshold', async () => {
        const response = await request(app)
            .post('/api/telegram/send-alert')
            .set('Authorization', 'Bearer valid-token')
            .send({
                weight: 95.5,
                timestamp: '2024-01-15 14:30:25'
            });
        
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });
});