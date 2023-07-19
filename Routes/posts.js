import express, { Router } from 'express'
import {getPostsFeed,getUserFeed,likePost,commentPost} from '../Controllers/Posts.js'
import { verifyToken } from '../Middleware/auth.js'

let router=express.Router()

// READ
router.get("/",verifyToken,getPostsFeed);
router.get("/:userId",verifyToken,getUserFeed);

// PATCH
router.patch("/:id/like",verifyToken,likePost)
router.patch("/:postId/comment",verifyToken,commentPost)

export default router;
