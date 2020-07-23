const bycrpt = require('bcryptjs');
const router = require('express').Router();

const Users = require('../users/users-model.js');

router.post('/register', (req, res) => {
  let creds = req.body;
  const rounds = process.env.HASH_ROUNDS || 4;

  const hash = bycrpt.hashSync(creds.password, rounds);

  creds.password = hash;

  Users.add(creds)
    .then((saved) => {
      res.status(201).json({ data: saved });
    })
    .catch((err) => {
      res.status(500).json({ error: error.message });
    });
});

router.post('/login', (req, res) => {
  //
});

router.get('logout', (req, res) => {
  //
});

module.exports = router;
