const { Schema, model } = require('mongoose');

const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const validate = function(email) {;
    return regex.test(email)
};


// Schema domyślnie dodaje unikalne pole _id, dlatego pomijamy je w deklaracji
const userSchema = new Schema({
    login: {
        type: String,
        required: [true, 'Login jest wymagany']},
    email: {
        type: String,
        required: [true, 'Email jest wymagany'],
        unique: true,
        validate: [validate],
        match: [regex]
    },
    registrationDate: Date,
});

module.exports = model('User', userSchema);
