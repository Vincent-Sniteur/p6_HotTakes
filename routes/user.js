// import express from 'express';
const express = require('express');
// create router by express
const router = express.Router();

// import controller user
const userCtrl = require('../controllers/user');

// route for user signup
router.post('/signup', userCtrl.signup);
// route for user login
router.post('/login', userCtrl.login);

//  export router
module.exports = router;