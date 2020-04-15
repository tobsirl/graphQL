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

### Aliases

Aliases allow you to rename the result of a field

```json
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

### Fragments
GraphQL includes reuseable units called fragments. Fragments let you construct sets of fields, and then include them in queries where you need to. 
```json
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

## Working with GraphQL

#### [graphiql](https://www.electronjs.org/apps/graphiql)

#### [Postman GraphQL](https://learning.postman.com/docs/postman/sending-api-requests/graphql/)
