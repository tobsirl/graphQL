import React from 'react';
import './App.css';
import axios from 'axios';

const axiosGitHubGraphQL = axios.create({
  baseURL: `https://api.github.com/graphql`,
  headers: {
    Authorization: `bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
});

function App() {
  const title = `React GraphQL Github Client`;
  return (
    <div className="App">
      <h1>{title}</h1>
    </div>
  );
}

export default App;
