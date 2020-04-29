import { GraphQLServer } from 'graphql-yoga';
import { customers, products, reviews } from './data';

const typeDefs = `
  type Query {
    customers(query: String): [Customer!]!
    products: [Product!]!
    reviews: [Review!]!
  }

  type Customer {
    id: ID!
    name: String!
    age: Int!
    loyalityCard: Boolean!
    products: [Product!]!
  }

  type Product {
    id: ID!
    name: String!
    price: Float!
    inStock: Boolean!
    customer: Customer!
  }

  type Review {
    id: ID!
    title: String!
    body: String!
    customer: Customer!
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
      return products;
    },
    reviews() {
      return reviews;
    },
  },
  Product: {
    customer(parent, args, ctx, info) {
      return customers.find((customer) => parent.customer === customer.id);
    },
  },
  Customer: {
    products(parent, args, ctx, info) {
      return products.filter((product) => parent.id === product.customer);
    },
  },
  Review: {
    customer(parent, args, ctx, info) {
      return customers.find((customer) => parent.customer === customer.id);
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

const PORT = 4000;

server.start(PORT, () => console.log(`Server started on ${PORT}`));
