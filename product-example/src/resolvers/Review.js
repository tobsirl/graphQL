const Review = {
  customer(parent, args, { db }, info) {
    return db.customers.find((customer) => parent.customer === customer.id);
  },
};

export default Review;
