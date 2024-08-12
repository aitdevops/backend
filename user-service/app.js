const express = require('express');
const bcrypt = require('bcrypt');
const app = express();

app.use(express.json());

let users = []; // This should be replaced with a database like Cloud SQL

app.post('/signup', (req, res) => {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const newUser = {
        id: users.length + 1,
        username: req.body.username,
        email: req.body.email,
        passwordHash: hashedPassword,
        approved: false
    };
    users.push(newUser);
    res.status(201).json({ message: "User created, waiting for approval." });
});

app.listen(3002, () => console.log('User service listening on port 3002'));
