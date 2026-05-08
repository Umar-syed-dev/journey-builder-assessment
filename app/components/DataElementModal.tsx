"use client";

import { useMemo, useState } from "react";
import type { FormField, PrefillMapping, PrefillOptionGroup } from "../lib/types";

type DataElementModalProps = {
  field: FormField;
  groups: PrefillOptionGroup[];
  onClose: () => void;
  onSelect: (mapping: PrefillMapping) => void;
};

export function DataElementModal({
  field,
  groups,
  onClose,
  onSelect,
}: DataElementModalProps) {
  const [query, setQuery] = useState("");
  const filteredGroups = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return groups;
    }

    return groups
      .map((group) => ({
        ...group,
        options: group.options.filter((option) =>
          [group.label, option.label, option.description]
            .filter(Boolean)
            .some((value) =>
              value?.toLowerCase().includes(normalizedQuery),
            ),
        ),
      }))
      .filter((group) => group.options.length > 0);
  }, [groups, query]);

  return (
    <div
      aria-labelledby="data-element-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-sm"
      role="dialog"
    >
      <div className="flex max-h-[86vh] w-full max-w-4xl flex-col overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20">
        <header className="border-b border-slate-200 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
                Select data element
              </p>
              <h2
                className="mt-2 text-2xl font-semibold text-slate-950"
                id="data-element-title"
              >
                Map {field.label}
              </h2>
            </div>
            <button
              className="rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-50"
              onClick={onClose}
              type="button"
            >
              Close
            </button>
          </div>

          <label className="mt-5 block">
            <span className="sr-only">Search data elements</span>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search fields and data sources"
              type="search"
              value={query}
            />
          </label>
        </header>

        <div className="grid min-h-0 flex-1 md:grid-cols-[280px_1fr]">
          <div className="overflow-y-auto border-b border-slate-200 bg-slate-50 p-4 md:border-b-0 md:border-r">
            <h3 className="px-2 text-sm font-semibold text-slate-700">
              Available data
            </h3>
            <div className="mt-3 space-y-2">
              {filteredGroups.map((group) => (
                <div
                  className="rounded-2xl border border-slate-200 bg-white p-3"
                  key={group.id}
                >
                  <p className="font-semibold text-slate-950">{group.label}</p>
                  {group.description ? (
                    <p className="mt-1 text-xs text-slate-500">
                      {group.description}
                    </p>
                  ) : null}
                  <p className="mt-2 text-xs font-medium text-cyan-700">
                    {group.options.length} options
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="min-h-0 overflow-y-auto p-5">
            {filteredGroups.length > 0 ? (
              <div className="space-y-6">
                {filteredGroups.map((group) => (
                  <section key={group.id}>
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold text-slate-950">
                        {group.label}
                      </h3>
                      {group.description ? (
                        <p className="text-sm text-slate-500">
                          {group.description}
                        </p>
                      ) : null}
                    </div>

                    <div className="grid gap-2">
                      {group.options.map((option) => (
                        <button
                          className="rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-cyan-400 hover:bg-cyan-50"
                          key={option.id}
                          onClick={() => onSelect(option.mapping)}
                          type="button"
                        >
                          <span className="font-semibold text-slate-950">
                            {option.label}
                          </span>
                          {option.description ? (
                            <span className="mt-1 block text-sm text-slate-500">
                              {option.description}
                            </span>
                          ) : null}
                        </button>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <div className="flex h-full min-h-72 items-center justify-center rounded-3xl border border-dashed border-slate-200 text-center">
                <div>
                  <p className="text-lg font-semibold text-slate-950">
                    No matches
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Try a different field or source name.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
