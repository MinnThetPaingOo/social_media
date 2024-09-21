const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/authController')
const { body } = require("express-validator");
const handleErrorMessage = require("../middlewares/handleErrorMessage");
const AuthMiddleware = require('../middlewares/handleErrorMessage')
const ProtectRoute = require('../middlewares/protectRoute')

router.post(
    '/api/auth/register',
    body("fullName").notEmpty(),
    body("userName").notEmpty(),
    body("email").notEmpty(),
    body("password").notEmpty(),
    handleErrorMessage,
    AuthController.register
)
router.post(
    '/api/auth/login',
    body("email").notEmpty(),
    body("password").notEmpty(),
    handleErrorMessage,
    AuthController.login
)

router.post(
    "/api/auth/logout",
    AuthController.logout
);

router.get('/api/auth/me',
    ProtectRoute,
    AuthController.getme
)
module.exports = router;


module.exports = router;