import { describe, expect, it } from "vitest";
import { isValidEmail, isValidTitle } from "./validation";

describe("validation helpers", () => {
  it("validates email format", () => {
    expect(isValidEmail("reviewer@example.com")).toBe(true);
    expect(isValidEmail("invalid-email")).toBe(false);
  });

  it("validates document title", () => {
    expect(isValidTitle("Project Plan")).toBe(true);
    expect(isValidTitle("   ")).toBe(false);
  });
});