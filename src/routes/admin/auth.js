const express = require('express');
const { signup, signin } = require('../../controller/admin/auth');
const router = express.Router();
const User = require('../../models/user');

router.post('/admin/signin', signin)

router.post('/admin/signup', signup);


module.exports = router;