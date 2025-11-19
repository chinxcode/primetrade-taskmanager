import { Router } from "express";
import {
    logoutUser,
    userRegister,
    loginUser,
    refreshAccessToken,
    getCurrentUser,
    updateUserProfile,
    changePassword,
} from "../controller/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(userRegister);

router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/profile").get(verifyJWT, getCurrentUser);
router.route("/profile").patch(verifyJWT, updateUserProfile);
router.route("/change-password").post(verifyJWT, changePassword);

export default router;
