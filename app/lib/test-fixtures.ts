import type { ActionBlueprintGraph } from "./types";

export const testGraph: ActionBlueprintGraph = {
  id: "graph-1",
  tenant_id: "tenant-1",
  name: "Test Journey",
  nodes: [
    {
      id: "form-a",
      type: "form",
      position: { x: 0, y: 0 },
      data: {
        id: "component-a",
        component_key: "form-a",
        component_type: "form",
        component_id: "schema-a",
        name: "Form A",
        prerequisites: [],
        input_mapping: {},
      },
    },
    {
      id: "form-b",
      type: "form",
      position: { x: 200, y: 0 },
      data: {
        id: "component-b",
        component_key: "form-b",
        component_type: "form",
        component_id: "schema-b",
        name: "Form B",
        prerequisites: ["form-a"],
        input_mapping: {},
      },
    },
    {
      id: "form-d",
      type: "form",
      position: { x: 400, y: 0 },
      data: {
        id: "component-d",
        component_key: "form-d",
        component_type: "form",
        component_id: "schema-d",
        name: "Form D",
        prerequisites: ["form-b"],
        input_mapping: {},
      },
    },
  ],
  edges: [
    { source: "form-a", target: "form-b" },
    { source: "form-b", target: "form-d" },
  ],
  forms: [
    {
      id: "schema-a",
      name: "Reusable A",
      field_schema: {
        type: "object",
        properties: {
          email: {
            avantos_type: "short-text",
            format: "email",
            title: "Email",
            type: "string",
          },
          name: {
            avantos_type: "short-text",
            title: "Name",
            type: "string",
          },
        },
        required: ["email"],
      },
      ui_schema: {
        type: "VerticalLayout",
        elements: [
          { type: "Control", scope: "#/properties/name", label: "Name" },
          { type: "Control", scope: "#/properties/email", label: "Email" },
        ],
      },
    },
    {
      id: "schema-b",
      name: "Reusable B",
      field_schema: {
        type: "object",
        properties: {
          approved: {
            avantos_type: "checkbox",
            title: "Approved",
            type: "boolean",
          },
        },
      },
    },
    {
      id: "schema-d",
      name: "Reusable D",
      field_schema: {
        type: "object",
        properties: {
          recipient_email: {
            avantos_type: "short-text",
            title: "Recipient Email",
            type: "string",
          },
        },
      },
    },
  ],
};
