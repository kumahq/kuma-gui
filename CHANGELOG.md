# CHANGELOG


## master

## [0.5.0]

> Released on 2020/05/12

### Updates / changes

* feat: Greatly improved pagination (depends on [#690 in Kuma](https://github.com/Kong/kuma/pull/690)) [[23](https://github.com/Kong/kuma-gui/pull/23)]
* feat: Entity total counts on the Global Overview page are now derived from the HTTP API (depends on [[#723 in Kuma](https://github.com/Kong/kuma/pull/723)]) [25](https://github.com/Kong/kuma-gui/pull/25)
* chore: Update the Mesh object to match the changes made to it in Kuma (depends on [704](https://github.com/Kong/kuma/pull/704)) [[24](https://github.com/Kong/kuma-gui/pull/24)]
* feat: Dataplane wizards for both Kubernetes and Universal [20](https://github.com/Kong/kuma-gui/pull/20)
* feat: A brand new Wizard tool and framework that will allow the user to create a new Mesh on the fly and allow them to choose the options that suit their needs (Tracing, Logging, Metrics, etc). This is the first of many Wizards to come [[#17](https://github.com/Kong/kuma-gui/pull/17)]
* feat: A tabbed and table view for all pages that simplifies and speeds up navigation, as well as viewing data relating to your entities. It eliminates all detail views, in favor of a tabbed view that loads when the user clicks table rows for the item they want to see information about. This means no more clicking a link in a table view, going to a new page, and then having to go back. Everything has been encompassed in one compact, fast overview [[#17](https://github.com/Kong/kuma-gui/pull/17)]
* feat: Fault Injections view added, and modified to use the brand new tabbed view [[#15](https://github.com/Kong/kuma-gui/pull/15)]
* feat: A brand new Kuma logo! [[#17](https://github.com/Kong/kuma-gui/pull/17)]
* feat: You can now view all entities across all of Kuma, or drill down by Mesh. This gives you a better overview on both a granular and larger scale [[#17](https://github.com/Kong/kuma-gui/pull/17)]
* feat: The GUI now uses new HTTP API endpoints that will give you information for all entities across all meshes, vs. on a per-Mesh basis. This also greatly improves performance in the GUI on pages like the Global Overview. The amount of requests is reduced and makes page weight lighter [[#657](https://github.com/Kong/kuma/pull/657)]
* chore: Multiple [Kongponents](https://kongponents.konghq.com/) updated to their latest versions
* feat: The sidebar menu has been streamlined
* chore: Multiple routes, pages, and other components removed that were no longer needed [[#17](https://github.com/Kong/kuma-gui/pull/17)]
* **Tons** of performance improvements and clean up under the hood
* fix: Fixed an error that occurred if there were >8 Dataplanes tags applied. Removed code that was no longer being used but was causing an error [[#13](https://github.com/Kong/kuma-gui/pull/13)]
* fix: Added `publicPath` to the Vue config so that all compiled assets use a relative path instead of absolute. This allows the GUI to be run from inside of a sub-directory as well as a root directory [[#14](https://github.com/Kong/kuma-gui/pull/14)]
* fix: Changed the REST function for getting Kuma's status from its config endpoint to an absolute path to prevent edge cases where it was unable to find the HTTP API endpoint [[#16](https://github.com/Kong/kuma-gui/pull/16)]
* fix: Chrome bugfixes [[#18](https://github.com/Kong/kuma-gui/pull/18)]
* fix: Fixed an issue where the Dataplanes view was failing if there were 8 or more tags present [[#618](https://github.com/Kong/kuma-gui/pull/618)]
* fix: Fixed an issue where the Mesh Selector in the sidebar was not holding onto the selected mesh after the user chose something (the value in the VueX store was taking importance over the `localStorage` value if there was one)

## [0.4.0]

> Released on 2020/02/28

* feat: [#8](https://github.com/Kong/kuma-gui/pull/8) Improved the evaluation function that handles the Total Updates calculations
* feat: [#9](https://github.com/Kong/kuma-gui/pull/9) Overhauled the `DataOverview` component that handles all of the Policy and Entity overviews (all pages). The data loading experience is now more consistent and helps ensure that things go smoothly when working with multiple entities
  * Improved the refresh function. Added a spinning icon to show when the data is refreshing, and disabled the button until the process is finished so that it can't accidentally be pressed multiple times
  * Fixed an issue where the refresh button wasn't working on all data overviews and would hang
* feat: [#10](https://github.com/Kong/kuma-gui/pull/10) New styles for `tags` on the Dataplanes overview
  * Tags are now styled to give a clear idea of tag labels and values. This helps with readability when a dataplane has multiple tags applied to it.
* feat: [#12](https://github.com/Kong/kuma-gui/pull/12) New TrafficTrace entity detail and list views 👍 contributed by @jakubdyszkiewicz

## [0.3.2]

> Released on 2020/01/10

* Smoother onboarding functionality
* Better Kuma configuration handling. The API URL and environment are always checked and stored whenever the GUI is run, and then re-checked every time the browser is reloaded. This ensures that the user's Kuma environment is accurately displayed, especially for instances where they might switch from universal to Kubernetes, and vice versa
* Better overall handling in cases where the Kuma API might be completely unreachable
* Detection of offline dataplanes in the onboarding process, with a control for refreshing the list without having to reload the entire page
* Color-coded status indicators for when a dataplane is either online or offline (red for offline, green for online)
* Better dataplane detail view UI to indicate when a dataplane is offline
* Health Checks page added
* Proxy Templates page added
* Improved dataplanes overview page that shows general stats for all policies and entities
* "View Entity" feature added to all entity detail views that allows the user to copy the entity to their clipboard in YAML format
* "Last Updated" and "Last Connected" times have been simplified for at-a-glance viewing (e.g. "30 minutes ago", "15 hours ago", "5 seconds ago", etc)
* YAML entities are now converted from their JSON source and displayed on all detail pages as highlighted markup
* Improved breadcrumbs that display the current mesh and provides a hierarchy of pages and labels for clearer navigation
* Simple pagination on all data table views
* All entities listed in data tables are now grouped by name and the mesh they are associated with
* Improved 404 handling for instances where the user might be viewing an entity or dataplane that no longer exists
* Various small improvements to all data overview components
* Some small responsive and CSS tweaks for the overall framework and components
* All informational and documentation links now automatically go to the version the user is running. This ensures they are always looking at the documentation most relevant to them
