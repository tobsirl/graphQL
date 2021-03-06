import bcryptjs from 'bcryptjs';

const hashPassword = (password) => {
  if (password.length < 8) {
    throw new Error(`Password must be 8 charactors or longer.`);
  }

  return bcryptjs.hash(password, 10);
};

export default hashPassword;
