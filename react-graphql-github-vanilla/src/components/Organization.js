import React from 'react';

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
        <strong>Issues from Organization:</strong>
        <a href={url}>{name}</a>
      </p>
    </div>
  );
};

export default Organization;
