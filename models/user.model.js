const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        max: 65
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        max: 65,
        validator: value => {
            if (!validator.isEmail(value)) {
                throw new Error({ error: 'Invalid Email address'  });
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8
    }
});

module.exports = mongoose.model('User', userSchema);
