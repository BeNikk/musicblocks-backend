export class Octokit {
  constructor() {}
  
  request = jest.fn();
  graphql = jest.fn();
  log = jest.fn();
  hook = jest.fn();
  auth = jest.fn();
}

export default Octokit;
