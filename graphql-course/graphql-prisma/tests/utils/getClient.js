import ApolloBoost from 'apollo-boost';

const getClient = () => {
  return new ApolloBoost({
    uri: 'http://localhost:4000',
  });
};

export default getClient;
