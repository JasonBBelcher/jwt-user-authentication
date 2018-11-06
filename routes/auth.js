const express = require('express');
const router = express.Router();
const { checkRegistrationToken } = require('../middleware/registration');
const { signup } = require('../handlers/auth');
const { signin } = require('../handlers/auth');

router.post('/signup', signup);
router.post('/signin', signin);

module.exports = router;
