const mongoose = require ('mongoose');

const Schema = mongoose.Schema;
const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now 
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('post', postSchema);