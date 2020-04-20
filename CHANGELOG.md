# Changelog

## 0.3.2

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

## 0.4.0

* [[#8](https://github.com/Kong/kuma-gui/pull/8)] Improved the evaluation function that handles the Total Updates calculations
* [[#9](https://github.com/Kong/kuma-gui/pull/9)] Overhauled the `DataOverview` component that handles all of the Policy and Entity overviews (all pages). The data loading experience is now more consistent and helps ensure that things go smoothly when working with multiple entities
  * Improved the refresh function. Added a spinning icon to show when the data is refreshing, and disabled the button until the process is finished so that it can't accidentally be pressed multiple times
  * Fixed an issue where the refresh button wasn't working on all data overviews and would hang
* [[#10](https://github.com/Kong/kuma-gui/pull/10)] New styles for `tags` on the Dataplanes overview
  * Tags are now styled to give a clear idea of tag labels and values. This helps with readability when a dataplane has multiple tags applied to it.
* [[#12](https://github.com/Kong/kuma-gui/pull/12)] New TrafficTrace entity detail and list views _(thank you, @jakubdyszkiewicz!)_

## 0.5.0-RC1

### Updates / changes

* [[#17](https://github.com/Kong/kuma-gui/pull/17)] [New] A brand new Wizard tool and framework that will allow the user to create a new Mesh on the fly and allow them to choose the options that suit their needs (Tracing, Logging, Metrics, etc). This is the first of many Wizards to come
* [[#17](https://github.com/Kong/kuma-gui/pull/17)] [New] A tabbed and table view for all pages that simplifies and speeds up navigation, as well as viewing data relating to your entities. It eliminates all detail views, in favor of a tabbed view that loads when the user clicks table rows for the item they want to see information about. This means no more clicking a link in a table view, going to a new page, and then having to go back. Everything has been encompassed in one compact, fast overview
* [[#15](https://github.com/Kong/kuma-gui/pull/15) [New] Fault Injections view added, and modified to use the brand new tabbed view
* [[#17](https://github.com/Kong/kuma-gui/pull/17)] [New] A brand new Kuma logo!
* [[#17](https://github.com/Kong/kuma-gui/pull/17)] [New] You can now view all entities across all of Kuma, or drill down by Mesh. This gives you a better overview on both a granular and larger scale
* [#657] The GUI now uses new HTTP API endpoints that will give you information for all entities across all meshes, vs. on a per-Mesh basis. This also greatly improves performance in the GUI on pages like the Global Overview. The amount of requests is reduced and makes page weight lighter
* Multiple [Kongponents](https://kongponents.konghq.com/) updated to their latest versions
* The sidebar menu has been streamlined
* [[#17](https://github.com/Kong/kuma-gui/pull/17)]Multiple routes, pages, and other components removed that were no longer needed
* **Tons** of performance improvements and clean up under the hood


### Fixes

* [#618] Fixed an issue where the Dataplanes view was failing if there were 8 or more tags present
* Fixed an issue where the Mesh Selector in the sidebar was not holding onto the selected mesh after the user chose something (the value in the VueX store was taking importance over the `localStorage` value if there was one)

