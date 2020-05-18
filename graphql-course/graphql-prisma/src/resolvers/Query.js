const Query = {
  users(parent, args, { prisma }, info) {
    const opArgs = {};

    if (args.query) {
      opArgs.where = {
        OR: [{ name_contains: args.query }, { email_contains: args.query }],
      };
    }

    return prisma.query.users(opArgs, info);
  },
  posts(parent, args, { prisma }, info) {
    const opArgs = {};

    if (args.query) {
      opArgs.where = {
        OR: [{ title_contains: args.query }, { body_contains: args.query }],
      };
    }

    return prisma.query.posts(opArgs, info);
  },
  comments(parent, args, { prisma }, info) {
    return prisma.query.comments(null, info);
  },
  me() {
    return {
      id: 'abc123',
      name: 'Mike',
      email: 'mike@gmail.com',
      age: 18,
    };
  },
  post() {
    return {
      id: '123abc',
      title: 'GraphQL is great',
      body: 'Having fun learning GraphQL',
      published: true,
    };
  },
};

export default Query;
