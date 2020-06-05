import 'cross-fetch/polyfill';
import '@babel/polyfill';
import { gql } from 'apollo-boost';
import prisma from '../src/prisma';
import seedDatabase, { userOne } from './utils/seedDatabase';
import getClient from './utils/getClient';

const client = getClient();

beforeEach(seedDatabase);

test('should expose published posts', async () => {
  const getPosts = gql`
    query {
      posts {
        title
        body
        published
      }
    }
  `;

  const response = await client.query({ query: getPosts });

  expect(response.data.posts.length).toBe(1);
  expect(response.data.posts[0].published).toBe(true);
});

test('should fetch users posts', async () => {
  const client = getClient(userOne.jwt);

  const myPosts = gql`
    query {
      myPosts {
        id
        title
        body
        published
      }
    }
  `;

  const { data } = await client.query({ query: myPosts });
  
  expect(data.myPosts.length).toBe(2);
  expect(data.myPosts[0].title).toBe("Jen's post");
  expect(data.myPosts[1].published).toBe(false);
});
