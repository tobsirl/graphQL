import jwt from 'jsonwebtoken';

const getUserId = (request, requireAuth = true) => {
  // get the header
  const header = request.request
    ? request.request.headers.authorization
    : request.connection.context.Authorization;

  // throw an error if the header isn't available
  if (header) {
    // get the token, remove bearer and space
    // alternative header.split(' ')[1]
    const token = header.replace('Bearer ', '');

    // use jwt to verify the token
    const decoded = jwt.verify(token, 'mysecret');

    // return the userId
    return decoded.userId;
  }

  if (requireAuth) {
    throw new Error(`Authentition required!`);
  }

  return null;
};

export default getUserId;
