import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';
import db from './db';

const resolvers = {
  Query: {
    customers(parent, args, { db }, info) {
      if (!args.query) return db.customers;
      return db.customers.filter((customer) =>
        customer.name.toLowerCase().includes(args.query.toLowerCase())
      );
    },
    products(parent, args, { db }, info) {
      return db.products;
    },
    reviews(parent, { title, body }, { db }, info) {
      if (!title && !body) return reviews;
      const matchTitle = db.reviews.filter((review) =>
        review.title.toLowerCase().includes(title.toLowerCase())
      );
      const matchBody = db.reviews.filter((review) =>
        review.body.toLowerCase().includes(body.toLowerCase())
      );

      return matchTitle || matchBody;
    },
  },
  Mutation: {
    createCustomer(parent, args, { db }, info) {
      const customerExists = db.customers.some(
        (customer) => customer.name === args.data.name
      );

      if (customerExists)
        throw Error(`${args.data.name} customer already exists`);

      const customer = {
        id: uuidv4(),
        ...args.data,
      };

      customers.push(customer);

      return customer;
    },
    deleteCustomer(parent, args, { db }, info) {
      const customerIndex = db.customers.findIndex(
        (customer) => customer.id === args.id
      );

      if (customerIndex === -1) throw new Error(`Customer not found`);

      const deletedCustomer = db.customers.splice(customerIndex, 1);

      db.products.filter((product) => {
        const match = product.id === args.id;

        if (match) {
          db.reviews.filter((review) => review.customer !== product.id);
        }

        return !match;
      });

      db.reviews.filter((review) => review.customer !== args.id);

      return deletedCustomer[0];
    },
    createProduct(parent, args, { db }, info) {
      const productExists = db.products.some(
        (product) => product.name === args.name
      );

      if (productExists) throw Error(`${args.name} product already exists`);

      const product = {
        id: uuidv4(),
        ...args,
      };

      db.products.push(product);

      return product;
    },
    createReview(parent, args, { db }, info) {
      const reviewExists = db.reviews.some(
        (review) => review.title === args.title
      );

      if (reviewExists) throw Error(`${args.title} review already exists`);

      const review = {
        id: uuidv4(),
        ...args,
      };

      db.reviews.push(review);

      return review;
    },
  },
  Product: {
    customer(parent, args, { db }, info) {
      return db.customers.find((customer) => parent.customer === customer.id);
    },
  },
  Customer: {
    products(parent, args, { db }, info) {
      return db.products.filter((product) => parent.id === product.customer);
    },
    reviews(parent, args, { db }, info) {
      return db.reviews.filter((review) => parent.id === review.customer);
    },
  },
  Review: {
    customer(parent, args, { db }, info) {
      return db.customers.find((customer) => parent.customer === customer.id);
    },
  },
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: {
    db,
  },
});

const PORT = 4000;

server.start(PORT, () => console.log(`Server started on ${PORT}`));
