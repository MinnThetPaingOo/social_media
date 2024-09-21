const express = require('express')
const router = express.Router()
const NotiController = require('../controllers/notiController')
const ProtectRoute = require('../middlewares/protectRoute')


router.get(
    '/api/notitications/all',
    ProtectRoute,
    NotiController.getnoti
)
router.delete(
    '/api/notitications/delete',
    ProtectRoute,
    NotiController.delete
)

module.exports = router;
