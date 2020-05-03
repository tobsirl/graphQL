const Query = {
  users(parent, args, { db }, info) {
    if (!args.query) {
      return db.users;
    }
    return db.users.filter((user) =>
      user.name.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
    );
  },
  posts(parent, args, { db }, info) {
    if (!args.query) return posts;

    return db.posts.filter((post) => {
      return (
        post.title
          .toLocaleLowerCase()
          .includes(args.query.toLocaleLowerCase()) ||
        post.body.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
      );
    });
  },
  comments(parent, args, { db }, info) {
    if (!args.query) return db.comments;
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
