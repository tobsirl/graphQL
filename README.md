# [GraphQL](https://graphql.org/)

GraphQL is an **open source query language** created by Facebook.
On the backend, GraphQL specifies to the API how to present the data to the client. GraphQL redefines developers’ work with APIs offering more flexibility and speed to market; it improves client-server interactions by enabling the former to make precise data requests and obtain no more and no less, but exactly what they need.

## GraphQL Fundamentals

### GraphQL Operation: Query

### Fields

GraphQL is about asking for specific fields on objects.
`Field` name returns a `Type` of `String`

```js
# request
{
  viewer {
    name
    url
  }
}

# response
{
  "data": {
    "viewer": {
      "name": "Paul Tobin",
      "url": "https://github.com/tobsirl"
    }
  }
}
```

---

### Arguments

Passing arguments allows us to specify the data we require.
Every field and nested object can get its own set of arguements, making GraphQL a complete replacement for making multiple API fetches.

```js
# request
{
  human(id: "1000") {
    name
    height
  }
}

# response
{
  "data": {
    "human": {
      "name": "Luke Skywalker",
      "height": 1.72
    }
  }
}
```

---

### Aliases

Aliases allow you to rename the result of a field

```js
# request
{
  empireHero: hero(episode: EMPIRE) {
    name
  }
  jediHero: hero(episode: JEDI) {
    name
  }
}

# response
{
  "data": {
    "empireHero": {
      "name": "Luke Skywalker"
    },
    "jediHero": {
      "name": "R2-D2"
    }
  }
}
```

In the above example, the two hero fields would have conflicted, but since we can alias them to different names, we can get both results in one request.

---

### Fragments

GraphQL includes reuseable units called fragments. Fragments let you construct sets of fields, and then include them in queries where you need to.

```js
{
  leftComparison: hero(episode: EMPIRE) {
    ...comparisonFields
  }
  rightComparison: hero(episode: JEDI) {
    ...comparisonFields
  }
}

fragment comparisonFields on Character {
  name
  appearsIn
  friends {
    name
  }
}
```

The concept of fragments is frequently used to split complicated application data requirements into smaller chunks, especially when you need to combine lots of UI components with different fragments into one initial data fetch.

---

### Operation name

Typically you can omit the query keyword and the query name, but in production apps it's useful to use these to make our code less ambiguous.

```js
query HeroNameAndFriends {
  hero {
    name
    friends {
      name
    }
  }
}
```

The _operation type_ is either _query_, _mutation_, or _subscription_ and describes what type of operation you're intending to do.
Using the _operation name_ is encouraged because it is very helpful when it comes to debugging and server-side logging.

---

### Variables

GraphQL has a first-class way to factor dynamic values out of a query, and pass them as a separate dictionary.
When we start working with variables, we need to do three things:

1. Replace the static value in the query with `$variableName`
2. Declare `$variableName` as one of the variables accepted by the query
3. Pass `variableName: value` in the separate, transport-specific variables dictionary

```js
query HeroNameAndFriends($episode: Episode) {
  hero(episode: $episode) {
    name
    friends {
      name
    }
  }
}
# VARIABLES
{
  "episode": "JEDI"
}
```

In the client code we can pass a different variable rather than needing to construct an entirely new query.

---

### Directives

A directive can be attached to a field or fragment inclusion, and can affect execution of the query in any way the server desires.

- @include(if: Boolean) Only include this field in the result if the argument is true.
- @skip(if: Boolean) Skip this field if the argument is true.

---

### Mutations

While most dicussion about GraphQL is centered around data fetching, any complete data platform needs a way to modify server-side data as well.

```js
mutation CreateReviewForEpisode($ep: Episode!, $review: ReviewInput!) {
  createReview(episode: $ep, review: $review) {
    stars
    commentary
  }
}
# VARIABLES
{
  "ep": "JEDI",
  "review": {
    "stars": 5,
    "commentary": "This is a great movie!"
  }
}
```

A mutation can contain multiple fields, just like a query. There's one important distinction between queries and mutations, other than the name:

**While query fields are executed in parallel, mutation fields run in series, one after the other.**

---

## Shortcomings of GraphQL in React without Apollo

The Apollo libary offers an abstraction that makes using GraphQL in React much easier. Using GraphQL without a supporting framework has shown us:

- How GraphQL works when using a puristic interface such as HTTP.
- The shortcomings of using no sophisticated GraphQL Client libary in React, having to do everything yourself.

Reasons for using a library like Apollo:

- **Complementary:** Using a HTTP client library like fetch or axios doesn't feel like the best fit to complement a GraphQL centred interface. GraphQL doesn't use the full potential of HTTP. GraphQL only uses the POST method and one API endpoint. It makes no sense to specify a HTTP method and an API endpoint with every request, but to set it up once in the beginning instead.

* **Declarative:** Every time you make a query or mutation using plain HTTP requests, you have to make a dedicated call to the API endpoint. This is an imperative way of reading and writing data to your backend. Apollo gives us a declarative approach, we can co-locate queries and mutations to our view-layer components.
* **Feature Support:** When using plain HTTP requests to interact with your GraphQL API, you are not leveraging the full potential of GraphQL. Imagine you want to split your query from the previous application into multiple queries that are co-located with their respective components where the data is used. That's when GraphQL would be used in a declarative way in your view-layer. But when you have no library support, you have to deal with multiple queries on your own, keeping track of all of them, and trying to merge the results in your state-layer. If you consider the previous application, splitting up the query into multiple queries would add a whole layer of complexity to the application. A GraphQL client library deals with aggregating the queries for you.
* **Data Handling:** The naive way for data handling with puristic HTTP requests is a subcategory of the missing feature support for GraphQL when not using a dedicated library for it. There is no one helping you out with normalizing your data and caching it for identical requests. Updating your state-layer when resolving fetched data from the data-layer becomes a nightmare when not normalizing the data in the first place. You have to deal with deeply nested state objects which lead to the verbose usage of the JavaScript spread operator.
* **GraphQL Subscriptions:** While there is the concept of a query and mutation to read and write data with GraphQL, there is a third concept of a GraphQL subscription for receiving real-time data in a client-sided application. When you would have to rely on plain HTTP requests as before, you would have to introduce WebSockets next to it. It enables you to introduce a long-lived connection for receiving results over time.

---

## [GraphQL Yoga](https://github.com/prisma-labs/graphql-yoga)

Type Definitions (Schema) - describes the operations that can be performed, the custom data types

Resolvers - set of functions that run for each of the operations

```js
import { GraphQLServer } from 'graphql-yoga';

// Type definitions (Schema)
const typeDefs = `
  type Query {
    hello: String!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    hello() {
      return 'This is my first query!';
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => console.log(`The server is up`));
```

### Scalar Types

A scalar value is a single discrete value. A scalar type is a type that stores a single value. There are five built-in scalar types in GraphQL.

1. **ID** - Used to store unique identifier.
2. **String** - Used to store string data as UTF-8 characters.
3. **Boolean** - Used to store true or false.
4. **Int** - Used to store 32-bit integer numbers.
5. **Float** - Used to store double-precision floating-point numbers.

Non-scalar value are **Arrays** and **Objects** which are a collection of values as opposed to a single discrete value.

```js
type Query {
    id: ID!
    name: String!
    age: Int!
    employed: Boolean!
    gpa: Float
  }
```

### Custom Types

```js
 type Query {
    post: Post!
  }

// Custom Type
type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }

// Resovler
post() {
    return {
      id: '123abc',
      title: 'GraphQL is great',
      body: 'Having fun learning GraphQL',
      published: true,
    };
  },
```

### Operation Arguments

```js
  type Query {
    greeting(name: String): String!
  }

  // Resolver
  greeting(parent, { name }, ctx, info) {
      return `Welcome to GraphQL ${name}`;
    },
```

### Working with Arrays

```js
type Query {
    users(query: String): [User!]!
  }

  users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }
      return users.filter((user) =>
        user.name.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
      );
    },
```

### Relational Data

Setting up relationships between object types allows you to query based on those relationships, this is on of the best features for GraphQL.

```js
type User {
    id: ID!
    name: String!
    email: String!
    age: Int
}
// Association between User and Posts
type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
}
// Resolvers to find the posts made by users
Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
}
```

### Relational Data: Arrays

```js
type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
}
// Association between user and posts
type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
}
// Using filter to find the users posts
User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => {
        return post.author === parent.id;
      });
    },
}
```

### Mutations

Mutations, like queries, must be defined in your application schema. Defining a mutation is similar to defining a query.
The major difference is that queries are defined on the `Query` type while mutations are defined on the `Mutation` type.

Resolver methods for mutations live on the `Mutation` property of the `resolover` object

```js
type Mutation {
    createUser(name: String!, email: String!, age: Int): User!
}

 Mutation: {
    createUser(parent, args, ctx, info) {
      // check if the email is already taken
      const emailTaken = users.some((user) => user.email === args.email);

      // throw an error if the email is taken
      if (emailTaken) {
        throw new Error(`Email taken ${args.email}`);
      }

      // create the user
      const user = {
        id: uuidv4(),
        name: args.name,
        email: args.email,
        age: args.age,
      };

      // save the user
      users.push(user);

      return user;
    },
}
```

### Input Type

The input type allows you to set up arguments as objects, given you more control over how your operations functions.

```js
type Mutation {
    createUser(user: CreateUserInput!): User!
  }

input CreateUserInput {
    name: String!
    email: String!
    age: Int!
  }
```

### Deleting Data using Mutation

Defining a mutation for deleting data is the same as a mutation for creating data. Mutations for deleting data typically require a single argument, the id of the data to be removed.

```js
type Mutation {
deleteUser(id: ID!): User!
}

deleteUser(parent, args, { db }, info) {
      // check if the user exists
      const userIndex = db.users.findIndex((user) => user.id === args.id);

      // throw an error if the user isn't found
      if (userIndex === -1) throw new Error(`User not found`);

      // delete the user using the index
      const deletedUsers = db.users.splice(userIndex, 1);

      posts.filter((post) => {
        const match = post.author === args.id;

        if (match) {
          db.comments.filter((comment) => comment.post !== post.id);
        }

        return !match;
      });

      db.comments.filter((comment) => comment.author !== args.id);

      return deletedUsers[0];
    },
```

When deleting data, it's important to clean up any associated data as well. For example

1. The user
2. Any post written by the user
3. All comments on the deleted posts (regardless of which users created the comments)
4. All comments left by the user on any other post

### Context

Making use of the ctx arguement that is passed to all resolvers. This allows us to divid the project into smaller files.

```js
context: {
    db,
  },

posts(parent, args, { db }, info) {
    return db.posts.filter((post) => {
      return post.author === parent.id;
    });
  },
```

### Subscriptions

Subscriptions give clients a way to subscribe to data changes and get notified by the server when data changes. This allows for the development of real-time applications.

```js
// schema.graphql
type Subscription {
  count: Int!
}

# index.js
import { GraphQLServer, PubSub } from 'graphql-yoga';

import Subscription from './resolvers/Subscription';

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Subscription,
  },
  context: {
    pubsub,
  },

# Subscription.js
const Subscription = {
  count: {
    subscribe(parent, args, { pubsub }, info) {
      let count = 0;

      setInterval(() => {
        count++;
        pubsub.publish('count', {
          count,
        });
      }, 10000);

      return pubsub.asyncIterator('count');
    },
  },
};
});
```

### ENUM ([Enumeration](https://graphql.org/learn/schema/#enumeration-types))

Also called Enums, enumeration types are a special kind of scalar that is restricted to a particular set of allowed values. This allows you to:

1. Validate that any arguments of this type are one of the allowed values
2. Communicate through the type system that a field will always be one of a finite set of values

```js
enum MutationType {
  CREATED
  UPDATED
  DELETED
}

type PostSubscriptionPayload {
  mutation: MutationType!
  data: Post!
}
```

---

## Working with GraphQL

#### [graphiql](https://www.electronjs.org/apps/graphiql)

#### [Postman GraphQL](https://learning.postman.com/docs/postman/sending-api-requests/graphql/)

---

## [Prisma](https://www.prisma.io/)

Prisma is an `open-source database toolkit`. It replaces traditional ORMs and makes database access easy with an auto-generated query builder for TypeScript (Prisma V2) and JavaScript (Prisma V1).

1. Install Prisma Latest Version 1.34

```shell
npm i -g prisma
```

2. Install docker toolbox

Follow the [instructions](https://docs.docker.com/toolbox/toolbox_install_windows/)

1. Run Prisma to generate files

```shell
prisma init
```

4. Run docker compose

```shell
docker-compose up -d
```

5. Run `prisma deploy`

### Integrating Prisma into a Node.js Project

To communicate with the Prisma GraphQL API we can use an npm package called Prisma Binding

Install Prisma Bindings [link](https://www.npmjs.com/package/prisma-binding)

```shell
npm install prisma-binding graphql-cli
```

### Example of using Prisma Binding

```js
const updatePostForUser = async (postId, data) => {
  const post = await prisma.mutation.updatePost(
    {
      data: {
        ...data,
      },
      where: {
        id: postId,
      },
    },
    `{ author { id } }`
  );

  const getUser = await prisma.query.user(
    {
      where: {
        id: post.author.id,
      },
    },
    `{ id name email posts { id title published }}`
  );
  return getUser;
};

updatePostForUser('cka5ifce4008d0755osksy6he', {
  title: 'test',
  body: 'to see',
  published: true,
}).then((user) => {
  console.log(JSON.stringify(user, null, 2));
});
```

### Checking if data exists

Using the exists property to determine if the post exists in the database.

```js
const postExist = await prisma.exists.Post({ id: postId });
```

### Using the @relation directive

Setting up relationships between the different types. You can determine what happens to a users posts if the user is deleted.
`onDelete: CASCADE` will delete the user along with all their posts, `onDelete: SET_NULL` will set the posts by the user to null.

```js
type User {
  id: ID! @id
  name: String!
  email: String! @unique
  posts: [Post!]! @relation(name: "PostToUser", onDelete: CASCADE)
  comments: [Comment!]! @relation(name: "CommentToUser", onDelete: CASCADE)
}

type Post {
  id: ID! @id
  title: String!
  body: String!
  published: Boolean!
  author: User! @relation(name: "PostToUser", onDelete: SET_NULL)
  comments: [Comment!]! @relation(name: "CommentToPost", onDelete: CASCADE)
}
```
### Adding Prisma to graphQL queries
Using the `info` parameter, `info` contains the query AST and more execution information
```js
users(parent, args, { prisma }, info) {
    const opArgs = {};

    if (args.query) {
      opArgs.where = {
        OR: [{ name_contains: args.query }, { email_contains: args.query }],
      };
    }

    return prisma.query.users(opArgs, info);
  },
```

### Adding Prisma to graphQL mutations
This dramatically reduces the amount of code required

```js
async createPost(parent, args, { prisma }, info) {
    const { title, body, published, author } = args.data;

    return await prisma.mutation.createPost(
      {
        data: {
          title: title,
          body: body,
          published: published,
          author: { connect: { id: author } },
        },
      },
      info
    );
  },
  async updatePost(parent, args, { prisma }, info) {
    const { id, data } = args;

    return await prisma.mutation.updatePost(
      { where: { id: id }, data: data },
      info
    );
  },
  async deletePost(parent, args, { prisma }, info) {
    return await prisma.mutation.deletePost({ where: { id: args.id } }, info);
  },
```

### Adding Prisma to graphQl subscriptions
```js
 comment: {
    subscribe(parent, { postId }, { prisma }, info) {
      return prisma.subscription.comment(
        {
          where: {
            node: {
              post: {
                id: postId,
              },
            },
          },
        },
        info
      );
    },
```

