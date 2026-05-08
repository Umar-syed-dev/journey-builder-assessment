export type FieldSchema = {
  avantos_type?: string;
  enum?: unknown[] | null;
  format?: string;
  items?: {
    enum?: unknown[];
    type?: string;
  };
  title?: string;
  type?: string;
  uniqueItems?: boolean;
};

export type FormSchema = {
  id: string;
  name: string;
  description?: string;
  field_schema: {
    type: "object";
    properties: Record<string, FieldSchema>;
    required?: string[];
  };
  ui_schema?: {
    type: string;
    elements?: Array<{
      type: string;
      scope?: string;
      label?: string;
      options?: Record<string, unknown>;
    }>;
  };
  dynamic_field_config?: Record<string, unknown>;
};

export type GraphNode = {
  id: string;
  type: string;
  position?: {
    x: number;
    y: number;
  };
  data: {
    id: string;
    component_key: string;
    component_type: string;
    component_id: string;
    name: string;
    prerequisites?: string[];
    input_mapping?: Record<string, PrefillMapping>;
  };
};

export type GraphEdge = {
  source: string;
  target: string;
};

export type ActionBlueprintGraph = {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  forms: FormSchema[];
};

export type FormField = {
  key: string;
  label: string;
  schema: FieldSchema;
  required: boolean;
};

export type FormNode = {
  id: string;
  componentId: string;
  blueprintComponentId: string;
  name: string;
  position: {
    x: number;
    y: number;
  };
  prerequisites: string[];
  fields: FormField[];
  inputMapping: Record<string, PrefillMapping>;
};

export type PrefillMapping = {
  sourceType: string;
  sourceId: string;
  sourceLabel: string;
  fieldKey: string;
  fieldLabel: string;
  formId?: string;
  formName?: string;
};

export type PrefillOption = {
  id: string;
  label: string;
  description?: string;
  mapping: PrefillMapping;
};

export type PrefillOptionGroup = {
  id: string;
  label: string;
  description?: string;
  options: PrefillOption[];
};

export type PrefillSourceContext = {
  graph: ActionBlueprintGraph;
  forms: FormNode[];
  selectedForm: FormNode;
};

export type PrefillDataSource = {
  id: string;
  label: string;
  getGroups(context: PrefillSourceContext): PrefillOptionGroup[];
};
