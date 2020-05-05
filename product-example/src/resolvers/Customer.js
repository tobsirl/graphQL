const Customer = {
  products(parent, args, { db }, info) {
    return db.products.filter((product) => parent.id === product.customer);
  },
  reviews(parent, args, { db }, info) {
    return db.reviews.filter((review) => parent.id === review.customer);
  },
};

export default Customer;
