const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const usersRouter = require('../users/users-router.js');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.json({ api: 'up' });
});

server.get('/hash', (req, res) => {
  const password = req.headers.authorization;
  const secret = req.headers.secret;
  const hash = hashString(secret);

  if (password === 'melon') {
    res.json({ welcome: 'friend', secret, hash });
  } else {
    res.status(401).json({ you: 'cannot pass!' });
  }
});

function hashString(str) {
  //use bcryptjs to hash the str argument and return the hash
  const rounds = process.env.HASH_ROUNDS || 4;
  const hash = bcrypt.hashSync(str, rounds);

  return hash;
}

module.exports = server;
