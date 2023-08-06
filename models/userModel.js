const mongoose = require("mongoose");



/// username => unique && email => unique && password === confirmPasword iftrue just encrypt User === await User.create(req.body)

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "please enter username"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "please enter password"]
    },
    confirmPassword: {
        type: String,
        required: [true, "please enter confirm password"]
    }
})

const User = mongoose.model("User", userSchema);

module.exports = User;


// email && password ==> token ===