const express = require('express');
const router = express.Router();
const post = require('../../models/post');
const { default: mongoose } = require('mongoose');

//All main Routes including the routes for Post
/*router.get('', (req, res) => {
    res.send('Hello World');
    }); //the empty string represent the home page */

router.get('', (req, res) => {
    const locals = {
        title: "Nodejs Blog",
        description: "Simple Blog created with Nodejs, Express & mongoDb."
    }

    res.render('index', { locals }); //index is the template to be rendered to the client. This is the home page
});

//This is to check your database add data to it to set it up, and it should only be done once which is why i am using the async function to check if it has 
//already been added. If it has it would skip it, because i called the function everytime the server restarts. From studies, this is called the seed data.
async function insertPostData () {
    const count = await post.countDocuments();
    if (count == 0) {
        await post.insertMany([
        {
            title: "Create a Blog",
            body: "This is the body text",
            //author: new mongoose.Schema.Types.ObjectId()
        },
        {
            title: "Learning How To Learn",
            body: "Using Scott Young Model to Learn How to Learn",
            //author: new mongoose.Schema.Types.ObjectId()
        },
        {
            title: "Asynchronous Programming",
            body: "Explore the asynchronous nature of Node.js, Learn how to use the 'await' keyword and what a promise is",
            //author: new mongoose.Schema.Types.ObjectId()
        },
        {
            title: "HTTP Request - Learning About HTTP",
            body: "Learning How to use HTTP methods such as GET, POST, DELETE, PUT. Also learning the concept of request and response",
            //author: new mongoose.Schema.Types.ObjectId()
        },
        {
            title: "Nodejs Limiting Network Traffic",
            body: "Learn how to limit network traffic",
            //author: new mongoose.Schema.Types.ObjectId()
        },
        ]); console.log("Sample data has been added");
    } 
    else {
        console.log("Sample data has already been added");
    }
}
insertPostData();
    

module.exports = router;