const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());  // Enable CORS

let users = []; // This should be replaced with a database like Cloud SQL

// Add a root route to respond to GET requests at '/'
app.get('/', (req, res) => {
    res.status(200).send('Auth Service is running');
});

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
