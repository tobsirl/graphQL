# [GraphQL](https://graphql.org/)

GraphQL is an **open source query language** created by Facebook.
On the backend, GraphQL specifies to the API how to present the data to the client. GraphQL redefines developers’ work with APIs offering more flexibility and speed to market; it improves client-server interactions by enabling the former to make precise data requests and obtain no more and no less, but exactly what they need.

## GraphQL Fundamentals

### GraphQL Operation: Query

#### request
```json
{
  viewer {
    name
    url
  }
}
```
#### response
```json
{
    "data": {
        "viewer": {
            "name": "Paul Tobin",
            "url": "https://github.com/tobsirl"
        }
    }
}
```

## [Postman GraphQL](https://learning.postman.com/docs/postman/sending-api-requests/graphql/)
