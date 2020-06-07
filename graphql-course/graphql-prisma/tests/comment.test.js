import 'cross-fetch/polyfill';
import '@babel/polyfill';
import prisma from '../src/prisma';
import seedDatabase, {
  userOne,
  commentOne,
  commentTwo,
} from './utils/seedDatabase';
import getClient from './utils/getClient';
import { deleteComment } from './utils/operations';

const client = getClient();

beforeEach(seedDatabase);

test('should be able to detele own comment', async () => {
  const client = getClient(userOne.jwt);

  const variables = {
    id: commentTwo.comment.id,
  };

  await client.mutate({ mutation: deleteComment, variables });
  const exists = await prisma.exists.Comment({ id: commentTwo.comment.id });

  expect(exists).toBe(false);
});

test('should not delete other users comment', async () => {
  const client = getClient(userOne.jwt);

  const variables = {
    id: commentOne.comment.id,
  };

  await expect(
    client.mutate({ mutation: deleteComment, variables })
  ).rejects.toThrow();
});
