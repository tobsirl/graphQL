import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  return jwt.sign({ userId }, 'mysecret', { expiresIn: '7 days' });
};

export default generateToken;
