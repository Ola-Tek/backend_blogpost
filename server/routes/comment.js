const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');


router.post('/posts/:postId/comments', commentController.createComment);
router.get('/posts/:postId/comments', commentController.getComment);
router.put('/comments/:commentId', commentController.updateComment);
router.delete('/comment/:commentId', commentController.deleteComment);

module.exports = router;