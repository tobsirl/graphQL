import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';
import { customers, products, reviews } from './data';

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
    reviews(parent, { title, body }, ctx, info) {
      if (!title && !body) return reviews;
      const matchTitle = reviews.filter((review) =>
        review.title.toLowerCase().includes(title.toLowerCase())
      );
      const matchBody = reviews.filter((review) =>
        review.body.toLowerCase().includes(body.toLowerCase())
      );

      return matchTitle || matchBody;
    },
  },
  Mutation: {
    createCustomer(parent, args, ctx, info) {
      const customerExists = customers.some(
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
    deleteCustomer(parent, args, ctx, info) {
      const customerIndex = customers.findIndex(
        (customer) => customer.id === args.id
      );

      if (customerIndex === -1) throw new Error(`Customer not found`);

      const deletedCustomer = customers.splice(customerIndex, 1);

      products.filter((product) => {
        const match = product.id === args.id;

        if (match) {
          reviews.filter((review) => review.customer !== product.id);
        }

        return !match;
      });

      reviews.filter((review) => review.customer !== args.id);

      return deletedCustomer[0];
    },
    createProduct(parent, args, ctx, info) {
      const productExists = products.some(
        (product) => product.name === args.name
      );

      if (productExists) throw Error(`${args.name} product already exists`);

      const product = {
        id: uuidv4(),
        ...args,
      };

      products.push(product);

      return product;
    },
    createReview(parent, args, ctx, info) {
      const reviewExists = reviews.some(
        (review) => review.title === args.title
      );

      if (reviewExists) throw Error(`${args.title} review already exists`);

      const review = {
        id: uuidv4(),
        ...args,
      };

      reviews.push(review);

      return review;
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
    reviews(parent, args, ctx, info) {
      return reviews.filter((review) => parent.id === review.customer);
    },
  },
  Review: {
    customer(parent, args, ctx, info) {
      return customers.find((customer) => parent.customer === customer.id);
    },
  },
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
});

const PORT = 4000;

server.start(PORT, () => console.log(`Server started on ${PORT}`));
