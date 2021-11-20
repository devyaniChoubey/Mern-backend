


const express = require('express');
const {createPage} = require('../../controller/admin/page')
const router = express.Router();
const { requireSignin, adminMiddleware, upload } = require('../../common-middleware');


router.post('/page/create', requireSignin, adminMiddleware, upload.fields([
    { name: 'banners' },
    { name: 'products' }
]), createPage)

module.exports = router;
