const express = require('express');
const cors = require('cors');
const redis = require('redis');
const { Client } = require('pg');

const app = express();
app.use(express.json());
app.use(cors());

// Redis client setup.
const redisClient = redis.createClient({
    url: 'redis://redis.aitdevops.com:6379'
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

redisClient.on('connect', async () => {
    console.log('Connected to Redis');
});

redisClient.connect().catch(console.error);

// PostgreSQL connection setup
const client = new Client({
    user: 'myuser',
    host: 'db.aitdevops.com',
    database: 'aitdevops-db',
    password: 'mypassword',
    port: 5432,
});

client.connect();

app.get('/', (req, res) => {
    res.status(200).send('Approval Service is running');
});

app.get('/approve/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);
    try {
        const cachedApproval = await redisClient.get(`user_approval_${userId}`);

        if (cachedApproval) {
            return res.json({ message: "User already approved." });
        }

        const result = await client.query(
            'UPDATE users SET approved = TRUE WHERE id = $1 RETURNING *',
            [userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "User not found!" });
        }

        await redisClient.set(`user_approval_${userId}`, 'true', {
            EX: 3600,
        }).catch(err => {
            console.error('Redis SET error:', err);
            throw new Error('Failed to cache approval status');
        });

        res.json({ message: "User approved successfully!" });
    } catch (error) {
        console.error('Error approving user:', error);
        res.status(500).json({ message: "Error approving user." });
    }
});

app.listen(3003, () => console.log('Approval service listening on port 3003'));
