# [GraphQL](https://graphql.org/)

GraphQL is an **open source query language** created by Facebook.
On the backend, GraphQL specifies to the API how to present the data to the client. GraphQL redefines developers’ work with APIs offering more flexibility and speed to market; it improves client-server interactions by enabling the former to make precise data requests and obtain no more and no less, but exactly what they need.

## GraphQL Fundamentals

### GraphQL Operation: Query

### Fields

GraphQL is about asking for specific fields on objects.
`Field` name returns a `Type` of `String`

```json
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

```json
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

## Working with GraphQL

#### [graphiql](https://www.electronjs.org/apps/graphiql)

#### [Postman GraphQL](https://learning.postman.com/docs/postman/sending-api-requests/graphql/)
```
