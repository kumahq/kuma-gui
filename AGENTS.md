# GUI and related packages for Kuma Service Mesh

## Commands

### Development

We use `make` for development. Running `make help` will provide you with the
majority available targets.

Each package has its own `make` targets. These can be run either by entering
the package directory and running, or by using `make`s `-C` flag e.g. `make -C
packages/package-name`. Each package also has its own `make help` that give you
the majority of available targets.

**Always prefer the existing `make` targets.** Do not reach past them to the
underlying tool (`vite`, `vitest`, `playwright`, `bddgen`, `eslint`, …) or to a
`node_modules/.bin` binary. The targets carry required environment, flags and
ordering that are easy to miss, and bypassing them produces failures that look
like problems with the code rather than with the invocation.

Before concluding that no target exists, check: each package has its own set of
`make` targets, discoverable by running `make help` in that package (or `make
-C <path> help` from the repository root). The target you want is often there
under a name you didn't guess.

If no target covers what you need, or you believe a target has to be run
differently (extra flags, overridden environment, a narrowed test selection):
stop, explain exactly what you intend to run and why the target is
insufficient, and ask for approval before running it. Do not substitute your
own command silently.

### Git & PRs

**PRs:** We squash merge PRs and use the PR description as the final commit
message. Therefore, when writing final PRs descriptions on multi-commit PRs
write it as if there was one atomic commit in the PR.

### Code comments

Any code comment written by an LLM must be marked as such so reviewers can tell
it apart from human written comments. Use the `MARKER(uid): body` form with
`llm` as the uid:

```ts
// NOTE(llm): explains why this is done this way
```

Mostly use `NOTE(llm):`. Only use another marker when the comment is something
other than an explanation, e.g. `TODO(llm):` for follow-up work or `FIXME(llm):`
for a known problem.

### KRIs

Kuma resources are identified by a KRI.

```
kri_<shortName>_<mesh>_<zone>_<namespace>_<name>_<sectionName>
```

Always exactly 7 `_`-separated segments. Any field may be empty but none may be
omitted, so a trailing `_` for an absent `sectionName` is required and a name
containing `_` cannot be represented.

When writing KRIs by hand (test fixtures, feature files), keep them consistent
with the resource's scope, which is listed per resource in
`packages/kuma-http-api/mocks/src/_resources.ts`:

- `Global` scope (`hg`, `m`, `z`) — `mesh` must be empty.
- `Mesh` scope (`dp`, `msvc`, `mzsvc`, `extsvc`, `mal`, `mfi`, `mid`, `mtrust`,
  `wl`, …) — `mesh` must be set, and must match the mesh in the URL path.
- An empty `zone` is valid and means the resource was created directly on the
  global control plane rather than synced from a zone. A `dp` (Dataplane) is the
  exception: it's a running proxy, so it always has a zone.
- An empty `namespace` is valid and means a universal (non-Kubernetes)
  deployment.

### Testing

For testing tasks, follow these rules:

- Check for available skills
- Write end-to-end or integration tests using Gherkin/Cucumber (`.feature` files)
- Create unit tests for business logic (`.spec.ts` files)
- Run test suites and analyze results
- Follow established testing patterns from existing test files

**Test Commands:**
- `make -C packages/kuma-gui test/e2e` - Run e2e tests from repository root
- `make -C packages/kuma-gui test/unit` - Run unit tests from repository root
- `make -C <path> test/unit` - Run unit tests of package/app in `path` from repository root

The test agent uses only existing Gherkin step definitions and never modifies
source code or removes failing tests.

---
