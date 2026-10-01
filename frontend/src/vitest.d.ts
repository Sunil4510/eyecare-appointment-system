/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";
import "vitest";

declare module "vitest" {
  interface Assertion<T = any>
    extends jest.Matchers<void, T>,
      TestingLibraryMatchers<T, void> {}
}
