import React, { useState, useEffect } from 'react';
import './App.css';
import Organization from './components/Organization';

import { GET_ISSUES_OF_REPOSITORY } from './graphQL/graphQL';
import { axiosGitHubGraphQL } from './utils/http';

const TITLE = 'React GraphQL GitHub Client';

const query = `
{
  organization(login: "the-road-to-learn-react") {
    name
    url
    repository(name: "the-road-to-learn-react") {
      name
      url
      issues(last: 15) {
        edges {
          node {
            id
            title
            url
          }
        }
      }
    }
  }
}
`;

const App = () => {
  const [path, setPath] = useState(
    'the-road-to-learn-react/the-road-to-learn-react'
  );
  const [organization, setOrganization] = useState(null);
  const [errors, setErrors] = useState(null);

  const opts = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ query }),
  };

  const onFetchFromGitHub = async () => {
    // axiosGitHubGraphQL
    //   .post('', { query: GET_ISSUES_OF_REPOSITORY })
    //   .then((result) => {
    //     setOrganization(result.data.data.organization);
    //     setErrors(result.data.errors);
    //   });
    const response = await fetch(`https://api.github.com/graphql`, opts)
    const result = await response.json();
    setOrganization(result.data.organization)
    
      // .then((res) => res.json())
      // .then((result) => {
      //   setOrganization(result.data.organization)
      //   // setErrors(result.data.errors)
      
      // });
  };

  useEffect(() => {
    onFetchFromGitHub();
  }, []);

  const onSubmit = (event) => {
    // fetch data
    event.preventDefault();
  };

  return (
    <div className="App">
      <h1>{TITLE}</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="url">Show open issues for https://github.com/</label>
        <input
          id="url"
          type="text"
          value={path}
          onChange={(event) => setPath(event.target.value)}
          style={{ width: '300px' }}
        />
        <button type="submit">Search</button>
      </form>
      <hr />
      {organization ? (
        <Organization organization={organization} errors={errors} />
      ) : (
        <p>No information yet ...</p>
      )}
    </div>
  );
};

export default App;
