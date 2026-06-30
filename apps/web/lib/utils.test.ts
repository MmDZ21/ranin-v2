import { describe, it, expect } from "vitest";
import { slugify, cn } from "./utils";

describe("slugify", () => {
  it("lowercases and hyphenates spaces", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("strips invalid characters", () => {
    expect(slugify("A/B  C!")).toBe("ab-c");
  });

  it("collapses repeated dashes", () => {
    expect(slugify("a---b")).toBe("a-b");
  });
});

describe("cn", () => {
  it("merges conflicting tailwind classes (last wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("ignores falsy values", () => {
    expect(cn("a", false && "b", "c")).toBe("a c");
  });
});
