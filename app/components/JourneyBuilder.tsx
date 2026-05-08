"use client";

import { useMemo, useState } from "react";
import { normalizeFormNodes } from "../lib/graph";
import { getPrefillOptionGroups } from "../lib/prefill-sources";
import type {
  ActionBlueprintGraph,
  FormField,
  PrefillMapping,
} from "../lib/types";
import { DataElementModal } from "./DataElementModal";
import { FormList } from "./FormList";
import { PrefillPanel } from "./PrefillPanel";

type JourneyBuilderProps = {
  graph: ActionBlueprintGraph;
};

export function JourneyBuilder({ graph }: JourneyBuilderProps) {
  const forms = useMemo(() => normalizeFormNodes(graph), [graph]);
  const [selectedFormId, setSelectedFormId] = useState(forms[0]?.id ?? "");
  const [activeField, setActiveField] = useState<FormField | null>(null);
  const [mappingsByForm, setMappingsByForm] = useState<
    Record<string, Record<string, PrefillMapping>>
  >(() =>
    Object.fromEntries(forms.map((form) => [form.id, form.inputMapping])),
  );

  const selectedForm = forms.find((form) => form.id === selectedFormId);

  if (!selectedForm) {
    return (
      <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-8 text-amber-900">
        No forms were found in this action blueprint.
      </div>
    );
  }

  const selectedMappings = mappingsByForm[selectedForm.id] ?? {};
  const optionGroups = activeField
    ? getPrefillOptionGroups({
        graph,
        forms,
        selectedForm,
      })
    : [];

  function updateMapping(fieldKey: string, mapping: PrefillMapping) {
    setMappingsByForm((current) => ({
      ...current,
      [selectedForm.id]: {
        ...(current[selectedForm.id] ?? {}),
        [fieldKey]: mapping,
      },
    }));
  }

  function clearMapping(fieldKey: string) {
    setMappingsByForm((current) => {
      const nextMappings = { ...(current[selectedForm.id] ?? {}) };
      delete nextMappings[fieldKey];

      return {
        ...current,
        [selectedForm.id]: nextMappings,
      };
    });
  }

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[340px_1fr]">
      <FormList
        forms={forms}
        onSelectForm={(formId) => {
          setSelectedFormId(formId);
          setActiveField(null);
        }}
        selectedFormId={selectedForm.id}
      />

      <div className="space-y-6">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 text-white shadow-xl shadow-slate-300/50">
          <div className="grid gap-4 p-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
                {graph.name}
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                Journey Builder Prefill
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Select a form, map its fields from upstream form submissions or
                shared global values, and clear mappings as requirements change.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 px-5 py-4">
              <p className="text-3xl font-semibold">{graph.nodes.length}</p>
              <p className="text-sm text-slate-300">graph nodes</p>
            </div>
          </div>
        </section>

        <PrefillPanel
          form={selectedForm}
          mappings={selectedMappings}
          onClearMapping={clearMapping}
          onOpenPicker={setActiveField}
        />
      </div>

      {activeField ? (
        <DataElementModal
          field={activeField}
          groups={optionGroups}
          onClose={() => setActiveField(null)}
          onSelect={(mapping) => {
            updateMapping(activeField.key, mapping);
            setActiveField(null);
          }}
        />
      ) : null}
    </div>
  );
}
