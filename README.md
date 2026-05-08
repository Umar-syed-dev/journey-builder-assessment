# Journey Builder Prefill Assessment

This is a small Next.js implementation of the Avantos Journey Builder prefill
flow. It fetches an action blueprint graph from the provided mock server, lists
the form nodes, and lets a user view, set, and clear field prefill mappings for
each form.

## Local Setup

Start the mock API server first. It should be running on `localhost:3000`:

```bash
cd path/to/frontendchallengeserver
npm install
npm start
```

Then run this app. Since the mock server uses port `3000`, Next.js will usually
start on `3001`:

```bash
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

## Configuration

The app defaults to the mock server endpoint:

```text
http://localhost:3000/api/v1/tenant-1/actions/blueprints/bp_01jk766tckfwx84xjcxazggzyc/graph
```

Override any part of that URL with environment variables:

```bash
ACTION_BLUEPRINT_API_BASE_URL=http://localhost:3000
ACTION_BLUEPRINT_TENANT_ID=tenant-1
ACTION_BLUEPRINT_ID=bp_01jk766tckfwx84xjcxazggzyc
```

## Project Structure

- `app/lib/api.ts` fetches the action blueprint graph.
- `app/lib/graph.ts` normalizes graph nodes, form schemas, and DAG dependencies.
- `app/lib/prefill-sources.ts` registers composable prefill data sources.
- `app/components/` contains the form list, prefill panel, and data picker UI.

## Adding Data Sources

The picker is driven by a `PrefillDataSource` contract:

```ts
type PrefillDataSource = {
  id: string;
  label: string;
  getGroups(context: PrefillSourceContext): PrefillOptionGroup[];
};
```

To add a new source, create an object that implements this contract and add it
to `prefillDataSources` in `app/lib/prefill-sources.ts`. UI components do not
need to change as long as the source returns `PrefillOptionGroup[]`.

## Quality Checks

```bash
npm run lint
npm test
npm run build
```
