const express = require('express');
const app = express();

app.use(express.json());

let users = []; // This should be replaced with a database like CloudSQL

app.post('/approve/:userId', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.userId));
    if (user) {
        user.approved = true;
        res.json({ message: "User approved successfully!" });
    } else {
        res.status(404).json({ message: "User not found!" });
    }
});

app.listen(3003, () => console.log('Approval service listening on port 3003'));
