const express = require('express');
const mongoose = require('mongoose');
const app = express();
const User = require('./models/User'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mern_stack', { useNewUrlParser: true, useUnifiedTopology: true });

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send('User registered');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).send('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Incorrect password');

    const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });
    res.json({ token });
});

app.get('/dashboard', (req, res) => {
    // protected route example
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Access denied');

    try {
        const verified = jwt.verify(token, 'secretKey');
        req.user = verified;
        res.send('Welcome to the dashboard');
    } catch (err) {
        res.status(400).send('Invalid token');
    }
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
