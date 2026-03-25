# GUI and related packages for Kuma Service Mesh

## Commands

### Development

We use `make` for development. Running `make help` will provide you with the
majority available targets.

Each package has its own `make` targets. These can be run either by entering
the package directory and running, or by using `make`s `-C` flag e.g. `make -C
packages/package-name`. Each package also has its own `make help` that give you
the majority of available targets.

### Git & PRs

**PRs:** We squash merge PRs and use the PR description as the final commit
message. Therefore, when writing final PRs descriptions on multi-commit PRs
write it as if there was one atomic commit in the PR.

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
