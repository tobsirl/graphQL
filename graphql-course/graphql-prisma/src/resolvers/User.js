import getUserId from '../utils/getUserId';

const User = {
  email(parent, args, { request }, info) {
    const userId = getUserId(request, false);

    if (userId && parent.id === userId) {
      return parent.email;
    } else {
      return null;
    }
  },
};

export default User;
