const fastify = require('fastify');
const gql = require('fastify-gql');
const { makeExecutableSchema } = require('graphql-tools');

const app = fastify();

const typeDefs = `
  type Query {
    hello: String!
    post: Post!
  }

  type Post 
`;

const resolvers = {
  Query: {
    hello() {
      return 'Hello';
    },
  },
};

app.register(gql, {
  schema: makeExecutableSchema({ typeDefs, resolvers }),
});

app.get('/', (req, reply) => {
  const query = '{ hello }';
  return reply.graphql(query);
});

const PORT = 3000;

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
