import express from 'express'
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
    getActiveUsers
} from '../Controllers/users.js'
import { verifyToken } from '../Middleware/auth.js'

let router = express.Router()

// READ 
router.get("/:id",verifyToken,getUser)
router.get("/:id/friends",verifyToken,getUserFriends)

// UPDATE 
router.patch("/:id/:friendId",verifyToken,addRemoveFriend);

export default router