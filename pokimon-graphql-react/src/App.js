import React from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

import './App.css';

function App() {
  const client = new ApolloClient({
    uri: `https://graphql-pokemon.now.sh`,
  });

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <h1>Pokimon</h1>
      </div>
    </ApolloProvider>
  );
}

export default App;
