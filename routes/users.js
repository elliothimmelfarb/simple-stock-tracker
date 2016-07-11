'use strict';

const express = require('express');
const User = require('../models/user');

let router = express.Router();

//   users.js
//   /api/users

router.get('/profile', User.authMiddleware, (req, res) => {
  console.log('req.user:', req.user);
  res.send(req.user);
});

router.get('/:id/getSymbols', (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err || !user) res.status(400).send(err || { error: 'User not found.' });
    user.getSymbols(symbols => {
      res.status(200).send(symbols);
    });
  });
});

router.put('/:id/addSymbol', (req, res) => {
  console.log(req.body);
  User.findByIdAndUpdate(req.params.id, { $push: { symbols: req.body.symbol } }, { new: true }, (err, updatedUser) => {
    if (err || !updatedUser) res.status(400).send(err || { error: 'User not found.' });
    res.status(200).send(updatedUser);
  });
});

router.delete('/:id/:symbol', (req, res) => {
  User.findByIdAndUpdate(req.params.id, { $pull: { symbols: req.params.symbol } }, { new: true }, (err, updatedUser) => {
    if (err || !updatedUser) res.status(400).send(err || { error: 'User not found.' });
    res.status(200).send(updatedUser);
  });
})

router.get('/', (req, res) => {
  // NOT FOR PRODUCTION - TESTING ONLY
  User.find({}, (err, users) => {
    if (err) return res.status(400).send(err);
    res.send(users);
  });
});

router.post('/register', (req, res) => {
  // Register a new user

  User.register(req.body, err => {
    res.status(err ? 400 : 200).send(err);
  });
});

router.post('/login', (req, res) => {
  // Authenticate a returning user

  User.authenticate(req.body, (err, user) => {
    console.log('err:', err);
    if (err) return res.status(400).send(err);

    let token = user.generateToken();

    res.cookie('authtoken', token).send(user);
  });
});

router.post('/logout', (req, res) => {
  res.clearCookie('authtoken').send();
});

router.delete('/:id', (req, res) => {
  User.findByIdAndRemove(req.params.id, err => {
    res.status(err ? 400 : 200).send(err);
  });
});


module.exports = router;
