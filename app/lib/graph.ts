import type {
  ActionBlueprintGraph,
  FieldSchema,
  FormField,
  FormNode,
  FormSchema,
  GraphNode,
} from "./types";

const controlScopePrefix = "#/properties/";

export function normalizeFormNodes(graph: ActionBlueprintGraph): FormNode[] {
  const formsById = new Map(graph.forms.map((form) => [form.id, form]));

  return graph.nodes
    .filter(isFormGraphNode)
    .map((node) => {
      const schema = formsById.get(node.data.component_id);

      if (!schema) {
        throw new Error(
          `No form schema found for graph node ${node.data.name} (${node.data.component_id})`,
        );
      }

      return {
        id: node.id,
        componentId: node.data.component_id,
        blueprintComponentId: node.data.id,
        name: node.data.name,
        position: node.position ?? { x: 0, y: 0 },
        prerequisites: node.data.prerequisites ?? [],
        fields: getFormFields(schema),
        inputMapping: node.data.input_mapping ?? {},
      };
    })
    .sort((left, right) => {
      const yDifference = left.position.y - right.position.y;

      if (Math.abs(yDifference) > 80) {
        return yDifference;
      }

      const xDifference = left.position.x - right.position.x;

      if (xDifference !== 0) {
        return xDifference;
      }

      return left.name.localeCompare(right.name);
    });
}

export function getFormFields(form: FormSchema): FormField[] {
  const requiredFields = new Set(form.field_schema.required ?? []);
  const properties = form.field_schema.properties;
  const orderedKeys = getUiFieldOrder(form, properties);

  return orderedKeys.map((key) => ({
    key,
    label: properties[key].title ?? humanizeFieldName(key),
    schema: properties[key],
    required: requiredFields.has(key),
  }));
}

export function getDirectDependencyIds(form: FormNode): string[] {
  return form.prerequisites;
}

export function getTransitiveDependencyIds(
  forms: FormNode[],
  formId: string,
): string[] {
  const formsById = new Map(forms.map((form) => [form.id, form]));
  const selectedForm = formsById.get(formId);

  if (!selectedForm) {
    return [];
  }

  const directIds = new Set(selectedForm.prerequisites);
  const result: string[] = [];
  const visited = new Set<string>();
  const queue = [...selectedForm.prerequisites];

  while (queue.length > 0) {
    const dependencyId = queue.shift();

    if (!dependencyId || visited.has(dependencyId)) {
      continue;
    }

    visited.add(dependencyId);
    const dependency = formsById.get(dependencyId);

    if (!dependency) {
      continue;
    }

    for (const parentId of dependency.prerequisites) {
      if (!visited.has(parentId)) {
        queue.push(parentId);
      }

      if (!directIds.has(parentId) && !result.includes(parentId)) {
        result.push(parentId);
      }
    }
  }

  return result;
}

export function getFormsByIds(forms: FormNode[], ids: string[]): FormNode[] {
  const formsById = new Map(forms.map((form) => [form.id, form]));

  return ids.flatMap((id) => {
    const form = formsById.get(id);
    return form ? [form] : [];
  });
}

export function humanizeFieldName(fieldKey: string): string {
  return fieldKey
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function isFormGraphNode(node: GraphNode): boolean {
  return node.type === "form" && node.data.component_type === "form";
}

function getUiFieldOrder(
  form: FormSchema,
  properties: Record<string, FieldSchema>,
): string[] {
  const uiKeys =
    form.ui_schema?.elements
      ?.map((element) => parseControlScope(element.scope))
      .filter(
        (key): key is string => key !== null && key in properties,
      ) ?? [];

  return [
    ...uiKeys,
    ...Object.keys(properties).filter((key) => !uiKeys.includes(key)),
  ];
}

function parseControlScope(scope?: string): string | null {
  if (!scope?.startsWith(controlScopePrefix)) {
    return null;
  }

  return scope.slice(controlScopePrefix.length);
}
