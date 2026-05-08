import {
  getDirectDependencyIds,
  getFormsByIds,
  getTransitiveDependencyIds,
} from "./graph";
import type {
  FormField,
  FormNode,
  PrefillDataSource,
  PrefillOption,
  PrefillOptionGroup,
  PrefillSourceContext,
} from "./types";

const globalOptions: PrefillOption[] = [
  {
    id: "action.status",
    label: "Action status",
    description: "Current workflow status",
    mapping: {
      sourceType: "global",
      sourceId: "action.status",
      sourceLabel: "Action Properties",
      fieldKey: "status",
      fieldLabel: "Action status",
    },
  },
  {
    id: "action.created_at",
    label: "Action created at",
    description: "Timestamp for the action instance",
    mapping: {
      sourceType: "global",
      sourceId: "action.created_at",
      sourceLabel: "Action Properties",
      fieldKey: "created_at",
      fieldLabel: "Action created at",
    },
  },
  {
    id: "organization.name",
    label: "Organization name",
    description: "Client organization display name",
    mapping: {
      sourceType: "global",
      sourceId: "organization.name",
      sourceLabel: "Client Organization Properties",
      fieldKey: "name",
      fieldLabel: "Organization name",
    },
  },
];

export const directDependencyFieldsSource: PrefillDataSource = {
  id: "direct-dependencies",
  label: "Direct dependency fields",
  getGroups(context) {
    const dependencyIds = getDirectDependencyIds(context.selectedForm);
    return buildFormGroups(
      getFormsByIds(context.forms, dependencyIds),
      this.id,
      "Fields from forms this form directly depends on.",
    );
  },
};

export const transitiveDependencyFieldsSource: PrefillDataSource = {
  id: "transitive-dependencies",
  label: "Upstream dependency fields",
  getGroups(context) {
    const dependencyIds = getTransitiveDependencyIds(
      context.forms,
      context.selectedForm.id,
    );

    return buildFormGroups(
      getFormsByIds(context.forms, dependencyIds),
      this.id,
      "Fields from earlier forms upstream in the journey.",
    );
  },
};

export const globalDataSource: PrefillDataSource = {
  id: "global",
  label: "Global data",
  getGroups() {
    return [
      {
        id: "global-data",
        label: "Global data",
        description: "Reusable values that are not tied to one form.",
        options: globalOptions,
      },
    ];
  },
};

export const prefillDataSources: PrefillDataSource[] = [
  directDependencyFieldsSource,
  transitiveDependencyFieldsSource,
  globalDataSource,
];

export function getPrefillOptionGroups(
  context: PrefillSourceContext,
  sources: PrefillDataSource[] = prefillDataSources,
): PrefillOptionGroup[] {
  return sources.flatMap((source) =>
    source.getGroups(context).map((group) => ({
      ...group,
      id: `${source.id}:${group.id}`,
      label: group.label,
      description: group.description ?? source.label,
    })),
  );
}

export function formatMappingLabel(mapping?: {
  sourceLabel: string;
  fieldLabel: string;
  formName?: string;
}): string {
  if (!mapping) {
    return "No prefill configured";
  }

  if (mapping.formName) {
    return `${mapping.formName}.${mapping.fieldLabel}`;
  }

  return `${mapping.sourceLabel}.${mapping.fieldLabel}`;
}

function buildFormGroups(
  forms: FormNode[],
  sourceType: string,
  description: string,
): PrefillOptionGroup[] {
  return forms.map((form) => ({
    id: form.id,
    label: form.name,
    description,
    options: form.fields.map((field) => buildFormFieldOption(form, field, sourceType)),
  }));
}

function buildFormFieldOption(
  form: FormNode,
  field: FormField,
  sourceType: string,
): PrefillOption {
  return {
    id: `${form.id}.${field.key}`,
    label: field.label,
    description: field.schema.avantos_type ?? field.schema.type,
    mapping: {
      sourceType,
      sourceId: `${form.id}.${field.key}`,
      sourceLabel: form.name,
      fieldKey: field.key,
      fieldLabel: field.label,
      formId: form.id,
      formName: form.name,
    },
  };
}
