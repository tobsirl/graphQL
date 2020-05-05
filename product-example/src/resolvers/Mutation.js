import { v4 as uuidv4 } from 'uuid';

const Mutation = {
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

    db.customers.push(customer);

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
};

export default Mutation;
