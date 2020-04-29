import { GraphQLServer } from 'graphql-yoga';
import { customers, products } from './data';

const typeDefs = `
  type Query {
    customers(query: String): [Customer!]!
    products(inStock: Boolean): [Product!]!
  }

  type Customer {
    id: ID!
    name: String!
    age: Int!
    loyalityCard: Boolean!
  }

  type Product {
    id: ID!
    name: String!
    price: Float!
    inStock: Boolean!
  }
`;

const resolvers = {
  Query: {
    customers(parent, args, ctx, info) {
      if (!args.query) return customers;
      return customers.filter((customer) =>
        customer.name.toLowerCase().includes(args.query.toLowerCase())
      );
    },
    products(parent, args, ctx, info) {
      if (!args.inStock) return customers;
      return products.filter((product) => product.inStock === args.inStock)
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

const PORT = 4000;

server.start(PORT, () => console.log(`Server started on ${PORT}`));
