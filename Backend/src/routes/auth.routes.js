const {Router} = require("express")
const authController = require("../controllers/auth.controller")
const {authUser} = require("../middlewares/auth.middleware")

const authRouter = Router()

/**
 * @route POST /api./auth/register
 * @description Register a new user
 * @access public
 */

authRouter.post("/register", authController.registerUserController)

/**
 * @route POST /api./auth/login
 * @description Login a user
 * @access public
 */
authRouter.post("/login", authController.loginUserController)

/**
 * @route GET /api/auth/logout
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
authRouter.get("/logout", authController.logoutUserController)

/**
 * r@route GET/api/auth/get-me
 * @description get the current logged in user details
 * @access private
 */
authRouter.get("/get-me", authUser, authController.getMeController)
module.exports = authRouter

