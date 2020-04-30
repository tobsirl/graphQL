const fastify = require('fastify');
const gql = require('fastify-gql');
const { makeExecutableSchema } = require('graphql-tools');

const app = fastify();

const typeDefs = `
  type Query {
    post: Post!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }
`;

const resolvers = {
  Query: {
    post() {
      return {
        id: '123abc',
        title: 'GraphQL is great',
        body: 'Having fun learning GraphQL',
        published: true,
      };
    },
  },
};

app.register(gql, {
  schema: makeExecutableSchema({ typeDefs, resolvers }),
});

app.get('/', (req, reply) => {
  const query = '{ post }';
  return reply.graphql(query);
});

const PORT = 3000;

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
