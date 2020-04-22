import 'dotenv/config';
import 'cross-fetch/polyfill';
import ApolloClient, { gql } from 'apollo-boost';

const GET_ORGANIZATION = gql`
  {
    organization(login: "the-road-to-learn-react") {
      name
      url
    }
  }
`;

const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  request: (operation) => {
    operation.setContext({
      headers: {
        authorization: `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
      },
    });
  },
});

client
  .query({
    query: GET_ORGANIZATION,
  })
  .then(console.log);

const userCredentials = { firstname: 'Robin' };
const userDetails = { nationality: 'German' };

const user = {
  ...userCredentials,
  ...userDetails,
};

// console.log(user);

// console.log(process.env.SOME_ENV_VARIABLE);
