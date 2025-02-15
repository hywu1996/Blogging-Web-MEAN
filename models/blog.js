const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;


let titleLengthChecker = (title) => {
    if (!title) {
        return false;
    } else {
        if (title.length < 5 || title.length > 50) {
            return false;
        } else {
            return true;
        }
    }
};

let alphaNumericTitleChecker = (title) => {
    if (!title) {
        return false;
    } else {
        const re = /^[a-zA-z0-9 ]+$/; //from stackoverflow by: community
        return re.test(title);
    }
};

const titleValidators = [
    {
        validator: titleLengthChecker, 
        message: 'Title must be between 5 and 50 characters long.'
    },
    {
        validator: alphaNumericTitleChecker, 
        message: 'Title must contain only letters, numbers or spaces.'
    }
];

let bodyLengthChecker = (body) => {
    if (!body) {
        return false;
    } else {
        if (body.length < 5 || body.length > 5000) {
            return false;
        } else {
            return true;
        }
    }
};

const bodyValidators = [
    {
        validator: bodyLengthChecker,
        message: "Body must be at least 5 characters but not more than 500."
    }
];

let commentLengthChecker = (comment) => {
    if (!comment[0]) {
        return false;
    } else {
        if (comment[0].length < 1 || comment[0].length > 200) {
            return false;
        } else {
            return true;
        }
    }
};

const commentValidators = [
    {
        validator: commentLengthChecker,
        message: 'Comment must not exceed 200 characters'
    }
];

const blogSchema = new Schema({
    title: { type: String, required: true, validate: titleValidators },
    body: { type: String, required: true, validate: bodyValidators },
    createdBy: { type: String },
    createdAt: { type: Date, default: Date.now() },
    likes: { type: Number, default: 0 },
    likedBy: { type: Array },
    dislikes: { type: Number, default: 0 },
    dislikedBy: { type: Array },
    comments: [
        {
            comment: { type: String, validate: commentValidators },
            commentator: { type: String }
        }
    ]
});

module.exports = mongoose.model('Blog', blogSchema);