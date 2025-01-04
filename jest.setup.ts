import "@testing-library/jest-dom";

// nanoid gives a syntax error without this (see: https://github.com/ai/nanoid/issues/363)
jest.mock("nanoid", () => { return {
    nanoid : ()=>{}
  } });