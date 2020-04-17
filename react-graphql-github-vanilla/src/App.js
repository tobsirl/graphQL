import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import Organization from './components/Organization';

const axiosGitHubGraphQL = axios.create({
  baseURL: `https://api.github.com/graphql`,
  headers: {
    Authorization: `bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
});

const GET_ORGANIZATION = `
  {
    organization(login: "the-road-to-learn-react") {
      name
      url
    }
  }
`;

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

  const onChange = (event) => {
    setPath(event.target.value);
  };

  const onSubmit = (event) => {
    // fetch data
    event.preventDefault();
  };

  const onFetchFromGitHub = () => {
    axiosGitHubGraphQL.post('', { query: GET_ORGANIZATION }).then((result) => {
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
          onChange={onChange}
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
