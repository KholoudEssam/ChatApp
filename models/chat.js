const mongoose = require('mongoose');

const user = require('./user');
const message = require('./message');

const chatSchema = new mongoose.Schema({
    anotherUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user',
    },
    message: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Chat', chatSchema);
