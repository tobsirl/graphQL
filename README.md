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
****

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
****

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
****

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
****

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
****

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
****
### Directives

A directive can be attached to a field or fragment inclusion, and can affect execution of the query in any way the server desires.

- @include(if: Boolean) Only include this field in the result if the argument is true.
- @skip(if: Boolean) Skip this field if the argument is true.

****
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

*****

## Working with GraphQL

#### [graphiql](https://www.electronjs.org/apps/graphiql)

#### [Postman GraphQL](https://learning.postman.com/docs/postman/sending-api-requests/graphql/)

