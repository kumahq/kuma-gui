# Releasing a new Kuma version

When a new version of Kuma is being prepared for release, a stabilization phase
takes place during which a release branch is prepared (e.g.
[`kumahq/kuma@release-2.1`](https://github.com/kumahq/kuma/tree/release-2.1)
for the release(s) of Kuma on version 2.1).

## Release tasks

### Creating the release branch

Whenever a new release branch is created in
[kumahq/kuma](https://github.com/kumahq/kuma), a new release branch of the
_exact_ same name should be created in Kuma GUI.

Any fixes/amends that need to land in the release should PR against newly
created release branch and then a PR created to merge the same fix/amend to
master, i.e. "fix it where it broke and port it forwards."

This release branch will include changes for version 2.1.0 but also possibly
for patch releases for that minor version (e.g. 2.1.1, 2.1.2, but not 2.2.0 or
2.2.1, etc.).

Automation ensures that new work on the GUI release branch is synced to
upstream kuma, similar to what happens normally for the `master` branch.


### Bumping package versions on master

Once the release branch has been created, you should then bump relevant package
versions on `master` so that the package versions on `master` are one release
ahead of the release branch i.e. `master` relevant package versions are now
"next version".

Currently we only bump `packages/kuma-gui/package.json` so that it stays in
sync with the kuma release.

## Post release tasks

At the time of writing there is a `Sync kumahq/kuma-gui with kumahq/kuma`
workflow which should be manually run which will sync relevant files from kuma
to kuma-gui.
