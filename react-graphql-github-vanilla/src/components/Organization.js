import React from 'react';
import Repository from './Repository';

const Organization = ({ organization, errors }) => {
  const { url, name } = organization;

  if (errors) {
    return (
      <p>
        <strong>Something went wrong:</strong>
        {errors.map((error) => error.message).join(' ')}
      </p>
    );
  }
  return (
    <div>
      <p>
        <strong>Issues from Organization: </strong>
        <a href={url}>{name}</a>
      </p>
      <Repository repository={organization.repository} />
    </div>
  );
};

export default Organization;
