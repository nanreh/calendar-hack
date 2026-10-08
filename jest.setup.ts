import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "util";

// React Router needs these and the jsdom test environment does not provide them
Object.assign(globalThis, { TextDecoder, TextEncoder });

// nanoid gives a syntax error without this (see: https://github.com/ai/nanoid/issues/363)
jest.mock("nanoid", () => { return {
    nanoid : ()=>{}
  } });