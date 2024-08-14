const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
    user: 'myuser',
    host: '10.253.0.3',
    database: 'mydatabase',
    password: 'mypassword',
    port: 5432,
});

app.get('/', (req, res) => {
    res.status(200).send('User Service is running');
});

app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = await pool.query(
            'INSERT INTO users (username, email, passwordhash) VALUES ($1, $2, $3) RETURNING *',
            [username, email, hashedPassword]
        );
        res.status(201).json({ message: "User created, waiting for approval.", user: newUser.rows[0] });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.listen(3002, () => console.log('User service listening on port 3002'));
