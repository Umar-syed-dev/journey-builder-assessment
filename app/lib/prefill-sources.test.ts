import { describe, expect, it } from "vitest";
import { normalizeFormNodes } from "./graph";
import {
  formatMappingLabel,
  getPrefillOptionGroups,
} from "./prefill-sources";
import { testGraph } from "./test-fixtures";

describe("prefill sources", () => {
  it("returns direct, upstream, and global option groups through one contract", () => {
    const forms = normalizeFormNodes(testGraph);
    const selectedForm = forms.find((form) => form.id === "form-d");

    expect(selectedForm).toBeDefined();

    const groups = getPrefillOptionGroups({
      graph: testGraph,
      forms,
      selectedForm: selectedForm!,
    });

    expect(groups.map((group) => group.label)).toEqual([
      "Form B",
      "Form A",
      "Global data",
    ]);
    expect(groups[0].options.map((option) => option.label)).toEqual([
      "Approved",
    ]);
    expect(groups[1].options.map((option) => option.label)).toEqual([
      "Name",
      "Email",
    ]);
    expect(groups[2].options.length).toBeGreaterThan(0);
  });

  it("formats configured mappings for display", () => {
    expect(
      formatMappingLabel({
        sourceLabel: "Form A",
        fieldLabel: "Email",
        formName: "Form A",
      }),
    ).toBe("Form A.Email");

    expect(
      formatMappingLabel({
        sourceLabel: "Action Properties",
        fieldLabel: "Action status",
      }),
    ).toBe("Action Properties.Action status");
  });
});
