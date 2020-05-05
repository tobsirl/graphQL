const Query = {
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
};

export default Query;
