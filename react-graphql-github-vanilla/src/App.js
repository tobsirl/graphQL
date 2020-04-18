import React, { useState, useEffect } from 'react';
import './App.css';
import Organization from './components/Organization';

import { GET_REPOSITORY_OF_ORGANIZATION } from './graphQL/graphQL';
import { axiosGitHubGraphQL } from './utils/http';

const TITLE = 'React GraphQL GitHub Client';

const App = () => {
  const [path, setPath] = useState(
    'the-road-to-learn-react/the-road-to-learn-react'
  );
  const [organization, setOrganization] = useState(null);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    onFetchFromGitHub();
  }, []);

  const onSubmit = (event) => {
    // fetch data
    event.preventDefault();
  };

  const onFetchFromGitHub = () => {
    axiosGitHubGraphQL
      .post('', { query: GET_REPOSITORY_OF_ORGANIZATION })
      .then((result) => {
        setOrganization(result.data.data.organization);
        setErrors(result.data.errors);
      });
  };

  return (
    <div>
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
