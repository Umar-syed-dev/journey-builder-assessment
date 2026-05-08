"use client";

import type { FormNode } from "../lib/types";

type FormListProps = {
  forms: FormNode[];
  selectedFormId: string;
  onSelectForm: (formId: string) => void;
};

export function FormList({
  forms,
  selectedFormId,
  onSelectForm,
}: FormListProps) {
  return (
    <aside className="rounded-4xl border border-slate-200 bg-white/85 p-4 shadow-sm shadow-slate-200/60 backdrop-blur">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
            Journey
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">Forms</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
          {forms.length}
        </span>
      </div>

      <div className="space-y-2">
        {forms.map((form) => {
          const isSelected = form.id === selectedFormId;

          return (
            <button
              className={`w-full rounded-2xl border p-4 text-left transition ${
                isSelected
                  ? "border-cyan-500 bg-cyan-50 text-slate-950 shadow-sm shadow-cyan-100"
                  : "border-slate-200 bg-white text-slate-700 hover:border-cyan-200 hover:bg-slate-50"
              }`}
              key={form.id}
              onClick={() => onSelectForm(form.id)}
              type="button"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold">{form.name}</span>
                <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-slate-500">
                  {form.fields.length} fields
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Depends on{" "}
                {form.prerequisites.length > 0
                  ? `${form.prerequisites.length} form${
                      form.prerequisites.length === 1 ? "" : "s"
                    }`
                  : "no forms"}
              </p>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
