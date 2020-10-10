const express = require('express');
const path = require('path');

const User = require('../models/user');
const router = express.Router();

router.post('/chat/:username', async (req, res) => {
    try {
        if (req.body.username) {
            let user = await User.findOne({ username: req.body.username });
            if (!user) {
                user = new User({
                    username: req.body.username,
                });
                await user.save();
            }
        }
        res.sendFile(path.join(__dirname, '../public/chat.html'));
    } catch (err) {
        console.log(err.message);
        res.sendFile(path.join(__dirname, '../public/notfound.html'));
    }
});

module.exports = router;
