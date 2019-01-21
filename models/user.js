const mongoose     = require('mongoose');
mongoose.Promise = global.Promise;
const Schema       = mongoose.Schema;
const bcrypt = require('bcrypt');
const saltrounds = 10;

let emailChecker = (email) => {
    if (!email) {
        return false;
    } else {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //from stackoverflow by: community
        return re.test(email);
    }
};

const emailValidators = [{
        validator: emailChecker, message: 'Invalid email format.'
}];

let usernameLengthChecker = (un) => {
    if (!un) {
        return false;
    } else {
        if (un.length < 3 || un.length > 15) {
            return false;
        } else {
            return true;
        }
    }
};

let validUsername = (un) => {
    if (!un) {
        return false;
    } else {
        const re = /^[a-zA-z0-9]+$/;
        return re.test(un);
    }
};

const usernameValidators = [
    {
        validator: usernameLengthChecker,
        message: "Username must be at least 3 characters but not more than 15."
    },
    {
        validator: validUsername,
        message: 'Username can only contain letters and numbers.'
    }
];

let passwordLengthChecker = (password) => {
    if (!password) {
        return false;
    } else {
        if (password.length < 8 || password.length > 35) {
            return false;
        } else {
            return true;
        }
    }
};

let validPassword = (pw) => {
    if (!pw) {
        return false;
    } else {
        const re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,35}$/;
        return re.test(pw);
    }
};

const passwordValidators = [
    {
        validator: passwordLengthChecker,
        message: 'Password must be between 8 and 35 characters'
    },
    {
        validator: validPassword,
        message: 'Password must have at least one uppercase letter, one lowercase letter, one number and one special character'
    }
];

const userSchema   = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true, validate: emailValidators },
    username:  { type: String, required: true, unique: true, lowercase: true, validate: usernameValidators },
    password: { type: String, required: true, validate: passwordValidators }
});



userSchema.pre('save', function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    bcrypt.hash(this.password, saltrounds, (err,hash) => {
        if (err) return next(err);
        this.password = hash;
        next();
    });
});

userSchema.methods.comparePassword = function(password, callback) {
    let ret;
    bcrypt.compare(password, this.password, (err, res) => { 
        callback(err, res); 
    });
};

module.exports = mongoose.model('User', userSchema);