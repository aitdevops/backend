const express = require('express');
const jwt = require('jsonwebtoken');
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
    res.status(200).send('Auth Service is running');
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = userResult.rows[0];
        if (user && bcrypt.compareSync(password, user.passwordhash)) {
            if (user.approved) {
                const token = jwt.sign({ id: user.id }, 'your_secret_key', { expiresIn: '1h' });
                res.json({ token });
            } else {
                res.status(403).json({ message: "User not approved!" });
            }
        } else {
            res.status(401).json({ message: "Invalid credentials!" });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.listen(3001, () => console.log('Auth service listening on port 3001'));
