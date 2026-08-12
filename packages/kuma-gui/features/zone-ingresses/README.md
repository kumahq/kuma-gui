# features / zone-ingresses

The gherkin `.feature`-files located here are separated from the general folder structure. The `zone-ingresses` module of the kuma-gui application is excluded from production by default and can be pulled in optionally. Therefore all the scenarios depend on the setting `KUMA_ZONE_INGRESSES_ENABLED: true` to be set.
At some point `zone-ingresses` may be removed completely without replacement.
