"use client";

import { formatMappingLabel } from "../lib/prefill-sources";
import type { FormField, FormNode, PrefillMapping } from "../lib/types";

type PrefillPanelProps = {
  form: FormNode;
  mappings: Record<string, PrefillMapping>;
  onClearMapping: (fieldKey: string) => void;
  onOpenPicker: (field: FormField) => void;
};

export function PrefillPanel({
  form,
  mappings,
  onClearMapping,
  onOpenPicker,
}: PrefillPanelProps) {
  return (
    <section className="rounded-4xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70">
      <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
            Prefill
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950">
            {form.name}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Configure default values from upstream forms or shared data.
          </p>
        </div>
        <div className="rounded-2xl bg-slate-950 px-4 py-3 text-sm text-white">
          <span className="font-semibold">{Object.keys(mappings).length}</span>{" "}
          mapped
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {form.fields.map((field) => {
          const mapping = mappings[field.key];

          return (
            <div
              className={`group flex flex-col gap-3 rounded-2xl border p-4 transition md:flex-row md:items-center md:justify-between ${
                mapping
                  ? "border-slate-200 bg-slate-50"
                  : "border-dashed border-cyan-300 bg-cyan-50/40 hover:border-cyan-500"
              }`}
              key={field.key}
            >
              <button
                className="flex flex-1 items-start gap-3 text-left"
                onClick={() => onOpenPicker(field)}
                type="button"
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm ring-1 ring-slate-200">
                  {field.schema.type === "array" ? "[]" : "{}"}
                </span>
                <span>
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-950">
                      {field.label}
                    </span>
                    {field.required ? (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                        required
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-1 block text-sm text-slate-500">
                    {mapping
                      ? formatMappingLabel(mapping)
                      : "Click to choose a source field"}
                  </span>
                </span>
              </button>

              {mapping ? (
                <button
                  aria-label={`Clear mapping for ${field.label}`}
                  className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                  onClick={() => onClearMapping(field.key)}
                  type="button"
                >
                  Clear
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
