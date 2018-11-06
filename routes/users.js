const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { user } = require('../handlers/user');

router.get('/me', auth, user);

module.exports = router;
