import { HttpError, HttpStatus } from '../src';

const error = new HttpError(HttpStatus.BAD_REQUEST, 'This is an error message');

it('should generate correct http code errors', () => {
  expect(error.code).toBe(HttpStatus.BAD_REQUEST);
  expect(error.message).toBe('This is an error message');
  expect(error.name).toBe(`Http Error ${HttpStatus.BAD_REQUEST}`);
});