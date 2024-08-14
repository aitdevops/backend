const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());  // Enable CORS

let users = []; // This should be replaced with a database like Cloud SQL

// Add a root route to respond to GET requests at '/'
app.get('/', (req, res) => {
    res.status(200).send('User Service is running');
});

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
