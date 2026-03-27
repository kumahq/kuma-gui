# action/bootstrap

Bootstraps repository by installing node, ensuring npm is at the same version
as `package.json:engines` and fills/retrieves the node_modules cache if
required.

Essentially used to centralize caching (and cache paths) of node_modules and
other dependencies.

## Usage

```yaml
  # as this action is a local action, ensure you have checked out this repository first
  - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
  # you only need to provide an `install-cmd` the first time in the workflow
  - uses: ./.github/actions/bootstrap/
    with:
      install-cmd: |
        make install
  # ...do something with make

  # all other instances in the workflow _do not_ need to provide an `install-cmd` again
  # the CI cache from the previous instance will be used
  - uses: ./.github/actions/bootstrap/
  # ...do something with make
```
