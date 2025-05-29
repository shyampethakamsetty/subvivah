const jwt = require('jsonwebtoken');

const payload = { userId: 123 };
const secret = 'my-very-secret-jwt-key';  // store in .env

const token = jwt.sign(payload, secret, { expiresIn: '1h' });
console.log(token);
