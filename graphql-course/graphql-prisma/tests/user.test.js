import { getFirstName, isValidPassword } from '../src/utils/user.js';

test('should return first name when given full name', () => {
  const firstName = getFirstName('Paul Tobin');

  expect(firstName).toBe('Paul');
});

test('should return first name when given first name', () => {
  const firstName = getFirstName('Jake');

  expect(firstName).toBe('Jake');
});

test('should reject password shorter that 8 characters', () => {
  const isValid = isValidPassword('pass123');

  expect(isValid).toBe(false);
});

test('should reject password that contains word password', () => {
  const passwordCheck = isValidPassword('123Password');

  expect(passwordCheck).toBe(false)
});

test('should correctly validate a valid password', () => {
  const isValid = isValidPassword('pass1234')
  expect(isValid).toBe(true)
});
