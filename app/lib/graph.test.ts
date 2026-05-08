import { describe, expect, it } from "vitest";
import {
  getDirectDependencyIds,
  getTransitiveDependencyIds,
  normalizeFormNodes,
} from "./graph";
import { testGraph } from "./test-fixtures";

describe("graph utilities", () => {
  it("normalizes graph nodes with their form schema fields", () => {
    const forms = normalizeFormNodes(testGraph);
    const formA = forms.find((form) => form.id === "form-a");

    expect(forms.map((form) => form.name)).toEqual([
      "Form A",
      "Form B",
      "Form D",
    ]);
    expect(formA?.fields.map((field) => field.key)).toEqual(["name", "email"]);
    expect(formA?.fields.find((field) => field.key === "email")?.required).toBe(
      true,
    );
  });

  it("resolves direct and transitive dependency ids separately", () => {
    const forms = normalizeFormNodes(testGraph);
    const formD = forms.find((form) => form.id === "form-d");

    expect(formD).toBeDefined();
    expect(getDirectDependencyIds(formD!)).toEqual(["form-b"]);
    expect(getTransitiveDependencyIds(forms, "form-d")).toEqual(["form-a"]);
  });
});
