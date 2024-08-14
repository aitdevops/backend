const express = require('express');
const { Client } = require('pg');
const app = express();

app.use(express.json());

const client = new Client({
    user: 'myuser',
    host: '10.253.0.3',
    database: 'mydatabase',
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
        const result = await client.query(
            'UPDATE users SET approved = TRUE WHERE id = $1 RETURNING *',
            [userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "User not found!" });
        }

        res.json({ message: "User approved successfully!" });
    } catch (error) {
        console.error('Error approving user:', error);
        res.status(500).json({ message: "Error approving user." });
    }
});

app.listen(3003, () => console.log('Approval service listening on port 3003'));
