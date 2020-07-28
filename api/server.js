const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const usersRouter = require('../users/users-router.js');
const authRouter = require('../auth/auth-router.js');
const dbConnection = require('../database/connection.js');

const server = express();

const sessionConfiguration = {
  name: 'monster',
  secret: process.env.SESSION_SECRET || 'shhh keep it safe!',
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: process.env.USE_SECURE_COOKIES || false, // you send the cookie only over https (secure connections)
    httpOnly: true, //prevents JS code on the client from accessing this cookie
  },
  resave: false,
  saveUninitialzed: true, //related to GDPR compliance only leave true in development.
  store: new KnexSessionStore({
    knex: dbConnection,
    tablename: 'sessions',
    sidfilename: 'sid',
    createtable: true,
    clearInterval: 1000 * 60 * 30, // time to check and remove expired sessions from the DB
  }),
};

server.use(session(sessionConfiguration)); //enables session support
server.use(helmet());
server.use(express.json());
server.use(cors());

server.use('/api/users', usersRouter);
server.use('/api/auth', authRouter);

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
