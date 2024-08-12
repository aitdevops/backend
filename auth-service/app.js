const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();

app.use(express.json());

let users = []; // This should be replaced with a database like Cloud SQL

app.post('/login', (req, res) => {
    const user = users.find(u => u.email === req.body.email);
    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        if (user.approved) {
            const token = jwt.sign({ id: user.id }, 'your_secret_key', { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(403).json({ message: "User not approved!" });
        }
    } else {
        res.status(401).json({ message: "Invalid credentials!" });
    }
});

app.listen(3001, () => console.log('Auth service listening on port 3001'));
