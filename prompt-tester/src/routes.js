const express = require('express');
const router = express.Router();

const controller = require('./controller');

router.post('/compare',(req,res)=>{
    controller.comparePrompt(req,res);
});

router.post('/test',(req,res)=>{
    controller.testPrompt(req,res);
});

module.exports = router;
