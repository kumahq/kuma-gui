# features / gateways

The gherkin `.feature`-files located here are separated from the general folder structure. The `gateways` module of the kuma-gui application is excluded from production by default and can be pulled in optionally. Therefore all the scenarios depend on the setting `KUMA_GATEWAYS_ENABLED: true` to be set.
At some point `gateways` may be removed completely without replacement.
