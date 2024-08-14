const express = require('express');
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
    res.status(200).send('Approval Service is running');
});

app.post('/approve/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        const user = userResult.rows[0];
        if (user) {
            await pool.query('UPDATE users SET approved = true WHERE id = $1', [userId]);
            res.json({ message: "User approved successfully!" });
        } else {
            res.status(404).json({ message: "User not found!" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.listen(3003, () => console.log('Approval service listening on port 3003'));
