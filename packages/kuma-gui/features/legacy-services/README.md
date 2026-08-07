# features / legacy-services

The gherkin `.feature`-files located here, are separated from the general folder structure. The `legacy-services` module of the kuma-gui application is excluded from production by default and can be pulled in optionally. Therefore all the scenarios depend on the setting `KUMA_LEGACY_SERVICE: true` to be set.
At some point `legacy-services` may be removed completely without replacement.
