const { Schema, model } = require('mongoose');

const postSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    text: String,
    responses: Number
});

module.exports = model('Post', postSchema);