import ApolloBoost, { gql } from 'apollo-boost';

const client = new ApolloBoost({
  uri: `http://localhost:4000/`,
});

const getUsers = gql`
  query {
    users {
      id
      name
    }
  }
`;

const getPosts = gql`
  query {
    posts {
      id
      title
      body
      published
      author {
        name
      }
    }
  }
`;

client
  .query({
    query: getUsers,
  })
  .then((response) => {
    let html = ``;

    response.data.users.forEach((user) => {
      html += `
        <div>
          <h3>${user.name}</h3>
        </div>
      `;
    });

    document.getElementById('users').innerHTML = html;
  });

client
  .query({
    query: getPosts,
  })
  .then((response) => {
    let html = ``;

    response.data.posts.forEach((post) => {
      html += `
        <div>
          <p>${post.title}</p>
          <p>${post.author.name}</p>
        </div>
      `;
    });

    document.getElementById('posts').innerHTML = html;
  });
