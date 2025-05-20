const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: true,
    },
    resetPassword: {
        type: String, //stores the hashed password
    },
    resetPasswordExpire: {
        type: Date, //stores the time for expiration
    }
});

//To hash the password in order to secure it using the bcrypt model. pre('save' ...) is a middle ware that helps to save the password temporarily beforeit is hashed
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) //This checks if the password was modified,changed or updated. The reason is because if it wasn't modified then it will skip and go to next which will hash the password
        return next;
    this.password = await bcrypt.hash(this.password, 10); // This promise is resolved before it moves on to the next, it hashes the password provided
    next();
});

//this.password = a method - it represent the hashed password

//We have to compare passwords to be sure the hashed password is the same as the candidate password
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);