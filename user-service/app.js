const express = require('express');
const bcrypt = require('bcrypt');
const axios = require('axios');
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
    res.status(200).send('User Service is running');
});

app.post('/signup', async (req, res) => {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const newUser = {
        username: req.body.username,
        email: req.body.email,
        passwordHash: hashedPassword,
    };

    try {
        const result = await client.query(
            'INSERT INTO users (username, email, passwordHash) VALUES ($1, $2, $3) RETURNING *',
            [newUser.username, newUser.email, newUser.passwordHash]
        );
        const createdUser = result.rows[0];

        // Cache the new user data in Redis
        redisClient.setex(`user_${createdUser.id}`, 3600, JSON.stringify(createdUser)); // Cache for 1 hour

        // Call the Cloud Function to send the approval email
        await axios.post('https://us-east1-devops-projects-426703.cloudfunctions.net/sendApprovalEmail', {
            id: createdUser.id,
            username: createdUser.username,
            email: createdUser.email,
        });

        res.status(201).json({ message: "User created, waiting for approval." });
    } catch (error) {
        console.error('Error saving user or sending approval email:', error);
        res.status(500).json({ message: "Error creating user or sending approval email." });
    }
});

app.listen(3002, () => console.log('User service listening on port 3002'));
