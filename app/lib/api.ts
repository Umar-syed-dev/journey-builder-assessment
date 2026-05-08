import type { ActionBlueprintGraph } from "./types";

const defaultApiBaseUrl = "http://localhost:3000";
const defaultTenantId = "tenant-1";
const defaultBlueprintId = "bp_01jk766tckfwx84xjcxazggzyc";

export function getGraphEndpoint(): string {
  const baseUrl =
    process.env.ACTION_BLUEPRINT_API_BASE_URL ?? defaultApiBaseUrl;
  const tenantId = process.env.ACTION_BLUEPRINT_TENANT_ID ?? defaultTenantId;
  const blueprintId =
    process.env.ACTION_BLUEPRINT_ID ?? defaultBlueprintId;

  return new URL(
    `/api/v1/${tenantId}/actions/blueprints/${blueprintId}/graph`,
    baseUrl,
  ).toString();
}

export async function fetchActionBlueprintGraph(): Promise<ActionBlueprintGraph> {
  const response = await fetch(getGraphEndpoint(), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to load action blueprint graph: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<ActionBlueprintGraph>;
}
