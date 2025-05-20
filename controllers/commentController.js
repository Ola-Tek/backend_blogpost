const Comment = require('../models/comment');
const Post = require('../models/post');

//create a comment
exports.createComment = async (req, res) => {
    try{
        const { postId } = req.params;
        const { content } = req.body;

        //checking if the post exist
        const post = await Post.findById(postId);
        if (!Post)
            return res.status(404).json({ message: 'Post Not Found'});

        //creating the comment
        const comment = await Comment.create({
            content,
            postId,
            userId: req.user._id
        });
        res.status(201).json({ message: 'Comment has been successfully created', comment})
    }
    catch (err) {
        res.status(500).json({ error: 'Server error during comment creation'});
    }
};

//To GET Comments
exports.getComment = async (req, res) => {
    try{
        const { postId } = req.params;

        //find the comment via the post
        const comments = await Comment.find({ postId }).populate('userId', 'username');

        res.status(200).json({ comments });
    }
    catch (err) {
        res.status(500).json({ ERROR: "Server Error, while fetching the comments" })
    }
};

//update comment
exports.updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;

        //find the comment
        const comment = await Comment.findById(commentId);
        if (!comment)
            return res.status(400).json({ message: "Comment not found"});

        //check if the user is the owner of the comment to be able to update or delete it 
        if (comment.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized Access'})
        }
        //if will update the content to the new content
        comment.content = content;
        await comment.save();

        res.status(200).json({ message: 'Comment Successfully updated'});
    }
    catch (err) {
        res.status(500).json({ message: "Server Error, please try again!"})
    }
};

exports.deleteComment = async (req, res) => {
    try{
        const { commentId } = req.params;

        //find the comment
        const comment = await Comment.findById(commentId);
        if (!comment)
            return res.status(404).json({ message: "Comment not Found"});

        //also check if you are authorized to delete the comment
        if (comment.userId.toString() !== req.user._id.toString())
        {
            return res.status(404).json({ message: 'Unauthorized Access'})
        }
        await comment.remove();
        res.status(200).json({ message: 'Comment deleted sucessfully'});
    }
    catch (err) {
        res.status(500).json({ message: "Server Error, try again in a short while"});
    }
};