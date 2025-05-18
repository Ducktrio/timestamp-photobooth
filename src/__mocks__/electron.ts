export const app = {
  getPath: jest.fn().mockReturnValueOnce(process.cwd() + '/tests/mock/user'),
};
