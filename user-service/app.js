const express = require('express');
const bcrypt = require('bcrypt');
const axios = require('axios');
const app = express();

app.use(express.json());

// PostgreSQL connection setup
const { Client } = require('pg');
const client = new Client({
    user: 'myuser',
    host: '10.253.0.3',
    database: 'mydatabase',
    password: 'mypassword',
    port: 5432,
});

client.connect();

// Add a root route to respond to GET requests at '/'
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

        // Call the Cloud Function to send the approval email
        await axios.post('https://us-east1-aitdevops8.cloudfunctions.net/sendApprovalEmail', {
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
