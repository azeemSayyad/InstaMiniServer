import express, { Router } from 'express'
import {getPostsFeed,getUserFeed,likePost, deletePost, commentPost} from '../Controllers/Posts.js'
import { verifyToken } from '../Middleware/auth.js'

let router=express.Router()

// READ
router.get("/",verifyToken,getPostsFeed);
router.get("/:userId",verifyToken,getUserFeed);

// PATCH
router.patch("/:id/like",verifyToken,likePost)
router.patch("/:postId/comment",commentPost)

//Delete
router.delete('/:postId/delete',verifyToken,deletePost);

export default router;
