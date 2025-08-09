import "@testing-library/jest-dom";
import React from "react";

// Mock next/navigation hooks used in components
jest.mock("next/navigation", () => {
  return {
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    }),
  };
});

// Mock next/image to render a normal img in tests without JSX in TS file
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const { fill, ...rest } = props || {};
    return React.createElement("img", rest);
  },
}));

// JSDOM helpers for Blob URLs used by components
// @ts-expect-error augment global URL
global.URL.createObjectURL = jest.fn(() => "blob:mock");
// @ts-expect-error augment global URL
global.URL.revokeObjectURL = jest.fn();
