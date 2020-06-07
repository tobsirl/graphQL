import 'cross-fetch/polyfill';
import '@babel/polyfill';
import prisma from '../src/prisma';
import seedDatabase, { userOne } from './utils/seedDatabase';
import getClient from './utils/getClient';
import { createUser, getUsers, login, getProfile } from './utils/operations';

const client = getClient();

beforeEach(seedDatabase);

test('should create two new users', async () => {
  const variables = {
    data: {
      name: 'Piers Morgan',
      email: 'piers@example.com',
      password: 'pass1234',
    },
  };

  const response = await client.mutate({
    mutation: createUser,
    variables,
  });

  const userExists = await prisma.exists.User({
    id: response.data.createUser.user.id,
  });

  expect(userExists).toBe(true);
});

test('should expose public author profiles', async () => {
  const response = await client.query({ query: getUsers });

  expect(response.data.users.length).toBe(2);
  expect(response.data.users[0].email).toBe(null);
  expect(response.data.users[0].name).toBe('Jen');
});

test('should not login in with bad credentials', async () => {
  const variables = {
    data: {
      email: 'jen@example.com',
      password: '1234pass',
    },
  };

  await expect(client.mutate({ mutation: login, variables })).rejects.toThrow();
});

test('should not signup user with invalid password', async () => {
  const variables = {
    data: {
      name: 'Alan',
      email: 'alan@example.com',
      password: 'pass12',
    },
  };

  await expect(
    client.mutate({ mutation: createUser, variables })
  ).rejects.toThrowError(
    new Error('GraphQL error: Password must be 8 charactors or longer.')
  );
});

test('should fetch user profile', async () => {
  const client = getClient(userOne.jwt);

  const { data } = await client.query({ query: getProfile });

  expect(data.me.id).toBe(userOne.user.id);
  expect(data.me.name).toBe(userOne.user.name);
  expect(data.me.email).toBe(userOne.user.email);
});
