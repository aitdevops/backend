const express = require('express');
const bcrypt = require('bcrypt');
const axios = require('axios');
const cors = require('cors');
const redis = require('redis');
const { Client } = require('pg');

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Redis client setup
const redisClient = redis.createClient({
    host: 'redis.aitdevops.com', // Use the custom DNS name
    port: 6379,
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.connect().catch(console.error); // Ensure client is connected

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
    try {
        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        const newUser = {
            username: req.body.username,
            email: req.body.email,
            passwordHash: hashedPassword,
        };

        // Check if Redis client is connected
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }

        const result = await client.query(
            'INSERT INTO users (username, email, passwordHash) VALUES ($1, $2, $3) RETURNING *',
            [newUser.username, newUser.email, newUser.passwordHash]
        );
        const createdUser = result.rows[0];

        // Cache the new user data in Redis
        await redisClient.set(`user_${createdUser.id}`, JSON.stringify(createdUser), 'EX', 3600).catch(err => {
            console.error('Redis SET error:', err);
            throw new Error('Failed to cache user data');
        });

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
