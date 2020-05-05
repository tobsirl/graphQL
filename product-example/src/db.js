const customers = [
  {
    id: '001',
    name: 'Jess',
    age: 23,
    loyalityCard: true,
  },
  {
    id: '002',
    name: 'Thomas',
    age: 42,
    loyalityCard: false,
  },
  {
    id: '003',
    name: 'Mark',
    age: 32,
    loyalityCard: false,
  },
];

const products = [
  {
    id: '10',
    name: 'Fishing Pole',
    price: 12.99,
    inStock: true,
    customer: '001',
  },
  {
    id: '20',
    name: 'Toaster',
    price: 49.99,
    inStock: true,
    customer: '003',
  },
  {
    id: '30',
    name: 'Keyboard',
    price: 19.99,
    inStock: false,
    customer: '002',
  },
  {
    id: '40',
    name: 'Mouse',
    price: 89.99,
    inStock: false,
    customer: '002',
  },
];

const reviews = [
  {
    id: '201',
    title: 'Best purchase',
    body: 'This is the body of the text',
    customer: '001',
  },
  {
    id: '202',
    title: 'Terrible product',
    body: 'Item never worked',
    customer: '001',
  },
  {
    id: '203',
    title: 'Book was very boring',
    body: `Couldn't get pass the first chapter`,
    customer: '002',
  },
  {
    id: '204',
    title: 'Great Product',
    body: 'New version is the best yet',
    customer: '002',
  },
  {
    id: '205',
    title: 'Got this dress in black',
    body: 'Finally got this in the color I want',
    customer: '002',
  },
  {
    id: '206',
    title: 'Best mouse',
    body: 'Bit on the expensive side',
    customer: '003',
  },
  {
    id: '207',
    title: 'Would buy again',
    body: 'Wish the ice-cream lasted longer',
    customer: '003',
  },
];

const db = {
  customers,
  products,
  reviews,
};

export { db as default };
