const express = require('express');
const router = express.Router();
const imgController = require('./controllers');

router.get('/profile/:userId', imgController.getUserImage);
router.post('/profile', imgController.changeUserImg)

module.exports = router;