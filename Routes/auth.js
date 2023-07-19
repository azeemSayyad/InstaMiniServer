import express from "express";
import { logOut, login } from "../Controllers/Auth.js";
import { verifyToken } from "../Middleware/auth.js";

const router= express.Router()

router.post("/login",login)
router.patch('/logout/:id',verifyToken,logOut);

export default router