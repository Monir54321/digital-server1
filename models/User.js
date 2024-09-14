const { default: mongoose } = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        lowercase: true,
        
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        
    },
    confirmPassword: {
        type: String,
        required: [true, "Please confirm your password"],
    },

    number: {
        type: String,
        trim: true
    },

    role: {
        type: String,
        enum: ['user', 'master'],
        default: 'user'
    },
    amount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const User = mongoose.model("Users", userSchema);

module.exports = User;