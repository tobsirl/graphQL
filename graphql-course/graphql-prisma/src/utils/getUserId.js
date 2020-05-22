import jwt from 'jsonwebtoken';

const getUserId = (request) => {
  // get the header
  const header = request.request.headers.authorization;

  // throw an error if the header isn't available
  if (!header) throw new Error(`Authentition required!`);

  // get the token, remove bearer and space
  // alternative header.split(' ')[1]
  const token = header.replace('Bearer ', '');

  // use jwt to verify the token
  const decoded = jwt.verify(token, 'mysecret');

  // return the userId
  return decoded.userId;
};

export default getUserId;
