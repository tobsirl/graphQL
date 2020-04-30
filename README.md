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
---

## Working with GraphQL

#### [graphiql](https://www.electronjs.org/apps/graphiql)

#### [Postman GraphQL](https://learning.postman.com/docs/postman/sending-api-requests/graphql/)
