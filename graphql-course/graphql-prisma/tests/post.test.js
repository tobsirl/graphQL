import 'cross-fetch/polyfill';
import '@babel/polyfill';
import { gql } from 'apollo-boost';
import prisma from '../src/prisma';
import seedDatabase, { userOne, postOne, postTwo } from './utils/seedDatabase';
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

test('should be able to update own post', async () => {
  const client = getClient(userOne.jwt);
  const updatePost = gql`
    mutation {
      updatePost(id: "${postOne.post.id}", data: {
        published: false
      }
      ){
        id
        title
        body 
        published
      }
    }
  `;

  const { data } = await client.mutate({ mutation: updatePost });
  const exists = await prisma.exists.Post({
    id: postOne.post.id,
    published: false,
  });

  expect(data.updatePost.published).toBe(false);
  expect(exists).toBe(true);
});

test('should be able to create post', async () => {
  const client = getClient(userOne.jwt);
  const createPost = gql`
    mutation {
      createPost(
        data: { title: "Test post", body: "Test post body", published: true }
      ) {
        id
        title
        body
        published
      }
    }
  `;

  const { data } = await client.mutate({ mutation: createPost });

  expect(data.createPost.title).toBe('Test post');
  expect(data.createPost.body).toBe('Test post body');
  expect(data.createPost.published).toBe(true);
});

test('should be able to delete a post', async () => {
  const client = getClient(userOne.jwt);
  const deletePost = gql`
    mutation {
      deletePost(
        id: "${postTwo.post.id}"
      ) {
        id
        title 
        body 
        published
      }
    }
  `;

  await client.mutate({ mutation: deletePost });

  const exists = await prisma.exists.Post({id: postTwo.post.id})
  
  expect(exists).toBe(false)
});
