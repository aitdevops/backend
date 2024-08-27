const express = require('express');
const cors = require('cors');
const redis = require('redis'); // Add Redis
const { Client } = require('pg');

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Redis client setup
const redisClient = redis.createClient({
    host: 'redis-service', // Redis service name in GKE
    port: 6379,
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

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
        // Check if the user's approval status is already cached
        redisClient.get(`user_approval_${userId}`, async (err, cachedApproval) => {
            if (cachedApproval) {
                return res.json({ message: "User approved successfully!" });
            } else {
                const result = await client.query(
                    'UPDATE users SET approved = TRUE WHERE id = $1 RETURNING *',
                    [userId]
                );

                if (result.rowCount === 0) {
                    return res.status(404).json({ message: "User not found!" });
                }

                // Cache the approval status
                redisClient.set(`user_approval_${userId}`, 3600, JSON.stringify(true)); // Cache for 1 hour
                res.json({ message: "User approved successfully!" });
            }
        });
    } catch (error) {
        console.error('Error approving user:', error);
        res.status(500).json({ message: "Error approving user." });
    }
});

app.listen(3003, () => console.log('Approval service listening on port 3003'));
