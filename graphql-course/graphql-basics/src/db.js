// Demo users data
const users = [
  {
    id: '1',
    name: 'Paul',
    email: 'paul@example.com',
    age: 24,
  },
  {
    id: '2',
    name: 'Keith',
    email: 'keith@example.com',
    age: 34,
  },
  {
    id: '3',
    name: 'Simon',
    email: 'simon@example.com',
    age: 28,
  },
];

// Demo posts data
const posts = [
  {
    id: '10',
    title: 'Post number 1 monkey',
    body: 'Contains of post number 1',
    published: true,
    author: '1',
  },
  {
    id: '20',
    title: 'Post number 2',
    body: 'Contains of post number 2, monkey',
    published: false,
    author: '1',
  },
  {
    id: '30',
    title: 'Post number 3',
    body: 'Contains of post number 3',
    published: true,
    author: '2',
  },
];

// Demo comments type
const comments = [
  {
    id: '111',
    text: 'This is the first comment 1',
    author: '1',
    post: '10',
  },
  {
    id: '112',
    text: 'This is the first comment 2',
    author: '1',
    post: '20',
  },
  {
    id: '113',
    text: 'This is the first comment 3',
    author: '2',
    post: '30',
  },
  {
    id: '114',
    text: 'This is the first comment 4',
    author: '3',
    post: '30',
  },
];

export default db = {
  users,
  posts,
  comments,
};
