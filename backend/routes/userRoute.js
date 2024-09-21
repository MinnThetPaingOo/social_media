const express = require('express')
const router = express.Router()
const UserController = require('../controllers/userController')
const ProtectRoute = require('../middlewares/protectRoute')
const userModel = require('../models/userModel')
const postModel = require('../models/postModel')
const upload = require('../helpers/upload')



router.get(
    '/api/user/profile/:userName',
    ProtectRoute,
    UserController.getUserProfile
)
router.post(
    '/api/user/updateprofile',
    ProtectRoute,
    UserController.updateprofile
)
router.post(
    '/api/user/follow/:userName',
    ProtectRoute,
    UserController.followOrUnfollow
)
router.get(
    '/api/user/suggest',
    ProtectRoute,
    UserController.suggest
)

router.post("/api/user/uploadProfilePictureAndCoverPhoto",
    ProtectRoute,
    upload.single('file'),
    UserController.uploadPP
)

module.exports = router;