const Post = require('../models/post');
const User = require('../models/user');

//creating the post
exports.createPost = async (req, res) => {
    try{
        const { title, body } = req.body;

        //check if the input is correct
        if (!title || !body)
            return res.status(400).json({ message: 'Title and body are required'});

        //create the post
        const post = await Post.create({
            title,
            body,
            author: req.user._id,
        });
        res.status(201).json({ message: 'Post sucessfully created'});
    }
    catch (err) {
        res.status(500).json({ message: 'Server Error'});
    }
};

//To get all the post
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username').sort({ createdAt: -1 });//this sorts the post according to the newest posts created
        res.status(200).json({ posts });
    }
    catch (err) {
        res.status(500).json ({ message: 'Server Error while fetching all the posts' });
    }
};

//getting just a single post
exports.getPostById = async (req, res) => {
    try {
        const { postId } = req.params

        const post = await Post.findById(postId).populate('author', 'username');
        if (!post)
            return res.status(404).json({ message: 'Post not Found'});

        res.status(200).json({ post });
    }
    catch (err) {
        res.status(500).json({ error: 'server error while fetching post' });
        }
    };

    //update a post
    exports.updatePost = async (req, res) => {
        try{
            const { postId } = req.params;
            const { title, body } = req.body
            
            const post = await Post.findById(postId);
            if (!post)
                return res.status(404).json({ message: 'Post not found'});
             //check if the user is authorized to update the post
            if (post.author.toString() !== req.user._id.toString())
            {
                return res.status(403).json({ message: 'Unauthorized to change post'});
            }
            post.title = title || post.title;
            post.body = body || post.body;
            post.updatedAt = Date.now();
            await post.save();
        
            res.status(200).json({ message: 'Post successfully updated'});
        }
        catch (err) {
            res.status(500).json({ message: 'Server Error'});
        }
    };

    //To delete the posts
    exports.deletePosts = async (req, res) => {
        try{
            const { postId } = req.params;

            //find the post through the id
            const post = await Post.findById(postId);
            if (!post)
                return res.status(404).json({ message: 'Post not found'});

            //check authorizAtion, if the user is authorized to delete the codes
            if (post.author.toString() !== req.user._id.toString())
                return res.status(400).json({ message: 'You are nor authorized to delete the post'});

            await post.remove();

            res.status(200).json({ message: 'Post successfully deleted'});
        }
        catch (err) {
            res.status(500).json({ message: 'Server Error while deleting posts'});
        }
    };
