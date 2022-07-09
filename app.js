// REQUIEREMENTS:

// import express from 'express';
const express = require('express');
// import mongoose from 'mongoose';
const mongoose = require('mongoose');




// CONNECTION TO MONGODB

mongoose.connect('mongodb+srv://Sniteur:vFDBbsQtaxo842O3@snit.04ik4.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log("MongoDB Connection Error : " + err));



// Crée const app pour l'appication, contient express pour le moment.
const app = express();

// autorisation général / a toute les requêtes
app.use((req, res, next) => {
    // autorise toutes les requêtes
    res.setHeader('Access-Control-Allow-Origin', '*');
    // autorise les requêtes avec les headers / entêtes
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // autorise les requêtes avec les méthodes GET, POST, PUT, DELETE
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next(); // permet de passer à la suite
});
















// EXPORT:

// Export app for server
module.exports = app;