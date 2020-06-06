import 'cross-fetch/polyfill';
import '@babel/polyfill';
import { gql } from 'apollo-boost';
import prisma from '../src/prisma';
import seedDatabase, { userOne } from './utils/seedDatabase';
import getClient from './utils/getClient';

const client = getClient();

beforeEach(seedDatabase);

const createUser = gql`
  mutation($data: CreateUserInput!) {
    createUser(data: $data) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

test('should create a new user', async () => {
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
  const getUsers = gql`
    query {
      users {
        id
        name
        email
      }
    }
  `;

  const response = await client.query({ query: getUsers });

  expect(response.data.users.length).toBe(1);
  expect(response.data.users[0].email).toBe(null);
  expect(response.data.users[0].name).toBe('Jen');
});

test('should not login in with bad credentials', async () => {
  const login = gql`
    mutation {
      login(data: { email: "jen@example.com", password: "1234pass" }) {
        token
      }
    }
  `;

  await expect(client.mutate({ mutation: login })).rejects.toThrow();
});

test('should not signup user with invalid password', async () => {
  const createUser = gql`
    mutation {
      createUser(
        data: { name: "Alan", email: "alan@example.com", password: "pass12" }
      ) {
        token
      }
    }
  `;

  await expect(client.mutate({ mutation: createUser })).rejects.toThrowError(
    new Error('GraphQL error: Password must be 8 charactors or longer.')
  );
});

test('should fetch user profile', async () => {
  const client = getClient(userOne.jwt);
  const getProfile = gql`
    query {
      me {
        id
        name
        email
      }
    }
  `;

  const { data } = await client.query({ query: getProfile });

  expect(data.me.id).toBe(userOne.user.id);
  expect(data.me.name).toBe(userOne.user.name);
  expect(data.me.email).toBe(userOne.user.email);
});
