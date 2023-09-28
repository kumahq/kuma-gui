# Releasing a new Kuma version

When a new version of Kuma is being prepared for release, a stabilization phase takes place during which a release branch is prepared (e.g. [`kumahq/kuma@release-2.1`](https://github.com/kumahq/kuma/tree/release-2.1) for the release(s) of Kuma on version 2.1). This release branch will include changes for version 2.1.0 but also possibly for patch releases for that minor version (e.g. 2.1.1, 2.1.2, but not 2.2.0 or 2.2.1, etc.).

**During this time, relevant changes in Kuma GUI *SHOULD* be merged into a release branch of the same name instead of the default branch.** Relevant changes are those which should be released alongside the new version of Kuma. Other changes *may* be merged into the project’s default branch.

Once the new version of Kuma was released, changes from the release branch are to be merged back into the project’s default branch.

## Creating the release branch

Whenever a new release branch is created in [kumahq/kuma](https://github.com/kumahq/kuma), a new release branch of the _exact_ same name should be created in Kuma GUI. New pull requests in Kuma GUI are opened against this branch.
