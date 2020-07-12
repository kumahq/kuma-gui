# CHANGELOG


## master

## [0.6.0]

> Released on 2020/06/30

* feat: shareable entity links [[#35](https://github.com/kumahq/kuma-gui/pull/35)]
* feat: mTLS warning on Traffic Permissions [[#38](https://github.com/kumahq/kuma-gui/pull/38)]
* feat: YAML view improvements: added separate tabs for Universal and Kubernetes YAML formatting [[#37](https://github.com/kumahq/kuma-gui/pull/37)]
* feat: Multicluster features [[#39](https://github.com/kumahq/kuma-gui/pull/39)]
  * Added new endpoints for fetching Gateway and Ingress Dataplanes _(caveat: pagination does not yet work for these endpoints)_
  * New view for Remote CPs (only enabled in Multicluster mode)
  * Multicluster mode detection features that are accessible across the entire GUI
  * Now displaying a tag next to the status in the top bar that lets the user know when Kuma is running in Multicluster mode
  * Expanded and improved tag handling for all Dataplane views to cover Inbound, Ingress, and Gateway tags
  * Added a new column to the Dataplanes tables that denotes the type of Dataplane (Standard, Ingress, Gateway)
  * Added functionality that detects when Kuma has been upgraded by storing the Kuma version in the browser's Local Storage. It will attempt to reload the page so that the user is viewing the latest GUI if the running version is prior to the version found at [https://kuma.io/latest_version](https://kuma.io/latest_version)

### Issues resolved

* fix: K8s DP wizard: the "Next" control is no longer appearing when selecting a Mesh -- this was caused by missing variable that was commented out but not reintroduced in this single view. [[#36](https://github.com/kumahq/kuma-gui/pull/36)]
* change: disable the "selected" effect when clicking on a row overview -- in the KTabs component, the tab content has an outline around it when clicked on. This change hides the outline. [[#36](https://github.com/kumahq/kuma-gui/pull/36)]
* fix: the Expiration Time on the Certificate Insights tab needs to be displayed as a regular date/time, not a human-readable relative one -- in all other instances of time and date being displayed, it's human-readable and relative. For this instance it simply needed to be the date/time itself with no additional modification. [[#36](https://github.com/kumahq/kuma-gui/pull/36)]
* fix / improvement: when there is a new version of Kuma, a force-refresh is required to make the GUI work, otherwise a blank screen is displayed. I was unable to reproduce this but have made multiple changes to try and address it [[#36](https://github.com/kumahq/kuma-gui/pull/36)]
  * I've made it so that the version is now stored in localStorage and the app checks the version from Kuma itself against the localStorage one. If they are different, the app updates the localStorage version string, and forces a reload on the page itself.
  * Additionally, I've changed the JS file chunk naming for every route in webpack's configuration. This means that instead of the compiled JS files always being randomized string names that are always completely different after every compile, they are named according to route. e.g. `12345678.js` would be renamed to something like `traffic-routes.js`.
  * In addition to the above, I have also added cache busting to the compiled JS files. So `traffic-routes.js` turns into `traffic-routes.js?t=1234abcd`. This helps ensure that each new version forces the browser to reload the JS files fresh.

NOTE:

⚠️ This release will require a force-refresh in your browser if you are coming from a previous version of Kuma. This is due optimization efforts to the JS and CSS files being namespaced instead of using auto-generated filenames.

## [0.5.1]

> Released on 2020/06/03

* feat: added icon for Dataplane and Mesh creation controls on their appropriate views. [[#28](https://github.com/kumahq/kuma-gui/pull/28)]
* feat: added creation and last modification times to the Mesh tabs view. [[#28](https://github.com/kumahq/kuma-gui/pull/28)]
* moved the resource counts to a tab in the Meshes view and have them formatted into columns automatically. cleaned up some unused store data. [[#28](https://]github.com/kumahq/kuma-gui/pull/28)]
* simplified the label styles for policies in the Mesh view. changed the Mesh view route title to Overview instead of Mesh Overview. [[#28](https://github.com/kumahq/kuma-gui/pull/28)]
* feat: added a stats view to the Meshes page that appears when there is a single Mesh selected. created a compact option for the MetricGrid component. [[#28](https://github.com/kumahq/kuma-gui/pull/28)]
* chore: shifted over every policy view to use the refactored LabelList changes. this change makes the component more open-ended so that we can easily modify what each policy view displays on a per-need basis. [[#28](https://github.com/kumahq/kuma-gui/pull/28)]
* feat: the Meshes view now displays information for mTLS, Logging, Metrics, and Tracing. [[#28](https://github.com/kumahq/kuma-gui/pull/28)]
* feat: initial refactoring of the LabelList and Meshes view to make the Overview tab more functional and open-ended. this is done to accommodate for the new data we are constantly adding to these views. [[#28](https://github.com/kumahq/kuma-gui/pull/28)]
* feat: rewrote the routes for the breadcrumbs and removed page titles to instead leverage breadcrumbs as page titles instead. [[#28](https://github.com/kumahq/kuma-gui/pull/28)]
* feat: add a component to check if the user has 0 dataplanes and only the default mesh. if both return true, an alert is displayed to optionally go through the onboarding process. [[#28](https://github.com/kumahq/kuma-gui/pull/28)]
* chore: cleaned out some unused route code in the Mesh Selector. comment added for clarity on new route param handling. [[#28](https://github.com/kumahq/kuma-gui/pull/28)]
* feat: the Global Overview is now filterable by mesh. new VueX actions for getting entity counts by mesh and storing them in state. improved the Mesh Selector component route and mesh handling to be more reliable and to eliminate edge cases where the selected mesh might not update. [[#28](https://github.com/kumahq/kuma-gui/pull/28)]
* chore: adjusted the sibling components around the Scanner in wizards to align with when the interval finishes out in the Scanner. [[#28](https://github.com/kumahq/kuma-gui/pull/28)]
* feat: set a fixed width on the frame around the page content, including sidebars. [[#28](https://github.com/kumahq/kuma-gui/pull/28)]
* chore: hid the tab view on dataplanes page when there are no dataplanes present. [[#28](https://github.com/kumahq/kuma-gui/pull/28)]
* feat: the tabbed view on all policy and entity views is now completely hidden if there is no data to display. if the user clicks the Refresh control and entities are found, the tabbed view will reappear and display data accordingly. [[#28](https://github.com/kumahq/kuma-gui/pull/28)]
* feat: improved the loading state handling for the DataOverview component and have hidden the tabbed view on the Fault Injections view unless there is data present. [[#28](https://github.com/kumahq/kuma-gui/pull/28)]
* feat: added link functionality to the MetricGrid so that each tile accepts a URL. overhauled the Global Overview grid styles, and removed code we no longer need since the Dataplane status table is now removed. [[#28](https://github.com/kumahq/kuma-gui/pull/28)]
* chore: improved and cleaned up the grid styles for the metric grid and CTAs on the global overview. [[#28](https://github.com/kumahq/kuma-gui/pull/28)]
* feat: removed the Dataplane status table from the Global Overview. added content to shortcut blocks on the Overview, as well as a third block. consolidated style overrides for the metrics grid. [[#28](https://github.com/kumahq/kuma-gui/pull/28)]
* feat: modified the content page width adjustment to encompass the breadcrumbs and page titles. [[#28](https://github.com/kumahq/kuma-gui/pull/28)]
* feat: modified the next and previous controls of the StepSkeleton so that previous is hidden if on the first step, and next is disabled if conditions not met, but hidden if on the last step. [[#28](https://github.com/kumahq/kuma-gui/pull/28)]
* chore(pagination) hid next and previous controls if they are not needed, vs having them set to disabled. [[#28](https://github.com/kumahq/kuma-gui/pull/28)]
* feat: New Certificate Insights tab on the Dataplanes views [[#33](https://github.com/kumahq/kuma-gui/pull/33)]
* feat: Upgrade warning - detects when the user is running an older version of Kuma and presents them with a notice and link to upgrade [[#31](https://github.com/kumahq/kuma-gui/pull/39)]

### Issues resolved

* fix: corrected the command output for Kubernetes in the Mesh wizard. added additional condition that accounts for a change made previously to improve the `FormatForCLI` helper command. [[#28](https://github.com/kumahq/kuma-gui/pull/28)]
* fix: fixed a typo in the Wizard Switcher component. [[#28](https://github.com/kumahq/kuma-gui/pull/28)]

## [0.5.0]

> Released on 2020/05/12

* feat: Greatly improved pagination (depends on [[#690 in Kuma](https://github.com/kumahq/kuma/pull/690)) [[#23](https://github.com/kumahq/kuma-gui/pull/23)]]
* feat: Entity total counts on the Global Overview page are now derived from the HTTP API (depends on [[#723 in Kuma](https://github.com/kumahq/kuma/pull/723)]) [[#25](https://github.com/kumahq/kuma-gui/pull/25)]
* chore: Update the Mesh object to match the changes made to it in Kuma (depends on [[#704](https://github.com/kumahq/kuma/pull/704)] in the Kuma repository) [[#24](https://github.com/kumahq/kuma-gui/pull/24)]
* feat: Dataplane wizards for both Kubernetes and Universal [[#20](https://github.com/kumahq/kuma-gui/pull/20)]
* feat: A brand new Wizard tool and framework that will allow the user to create a new Mesh on the fly and allow them to choose the options that suit their needs (Tracing, Logging, Metrics, etc). This is the first of many Wizards to come [[#17](https://github.com/kumahq/kuma-gui/pull/17)]
* feat: A tabbed and table view for all pages that simplifies and speeds up navigation, as well as viewing data relating to your entities. It eliminates all detail views, in favor of a tabbed view that loads when the user clicks table rows for the item they want to see information about. This means no more clicking a link in a table view, going to a new page, and then having to go back. Everything has been encompassed in one compact, fast overview [[#17](https://github.com/kumahq/kuma-gui/pull/17)]
* feat: Fault Injections view added, and modified to use the brand new tabbed view [[#15](https://github.com/kumahq/kuma-gui/pull/15)]
* feat: A brand new Kuma logo! [[#17](https://github.com/kumahq/kuma-gui/pull/17)]
* feat: You can now view all entities across all of Kuma, or drill down by Mesh. This gives you a better overview on both a granular and larger scale [[#17](https://github.com/kumahq/kuma-gui/pull/17)]
* feat: The GUI now uses new HTTP API endpoints that will give you information for all entities across all meshes, vs. on a per-Mesh basis. This also greatly improves performance in the GUI on pages like the Global Overview. The amount of requests is reduced and makes page weight lighter [[#657](https://github.com/kumahq/kuma/pull/657)]
* chore: Multiple [Kongponents](https://kongponents.konghq.com/) updated to their latest versions
* feat: The sidebar menu has been streamlined
* chore: Multiple routes, pages, and other components removed that were no longer needed [[#17](https://github.com/kumahq/kuma-gui/pull/17)]
* **Tons** of performance improvements and clean up under the hood
* fix: Fixed an error that occurred if there were >8 Dataplanes tags applied. Removed code that was no longer being used but was causing an error [[#13](https://github.com/kumahq/kuma-gui/pull/13)]
* fix: Added `publicPath` to the Vue config so that all compiled assets use a relative path instead of absolute. This allows the GUI to be run from inside of a sub-directory as well as a root directory [[#14](https://github.com/kumahq/kuma-gui/pull/14)]
* fix: Changed the REST function for getting Kuma's status from its config endpoint to an absolute path to prevent edge cases where it was unable to find the HTTP API endpoint [[#16](https://github.com/kumahq/kuma-gui/pull/16)]
* fix: Chrome bugfixes [[#18](https://github.com/kumahq/kuma-gui/pull/18)]
* fix: Fixed an issue where the Dataplanes view was failing if there were 8 or more tags present [[#618](https://github.com/kumahq/kuma-gui/pull/618)]
* fix: Fixed an issue where the Mesh Selector in the sidebar was not holding onto the selected mesh after the user chose something (the value in the VueX store was taking importance over the `localStorage` value if there was one)

## [0.4.0]

> Released on 2020/02/28

* feat: Improved the evaluation function that handles the Total Updates calculations [[#8](https://github.com/kumahq/kuma-gui/pull/8)]
* feat: Overhauled the `DataOverview` component that handles all of the Policy and Entity overviews (all pages). ]The data loading experience is now more consistent and helps ensure that things go smoothly when working with multiple entities [[#9](https://github.com/kumahq/kuma-gui/pull/9)]
  * Improved the refresh function. Added a spinning icon to show when the data is refreshing, and disabled the button until the process is finished so that it can't accidentally be pressed multiple times
  * Fixed an issue where the refresh button wasn't working on all data overviews and would hang
* feat: New styles for `tags` on the Dataplanes overview [[#10](https://github.com/kumahq/kuma-gui/pull/10)]
  * Tags are now styled to give a clear idea of tag labels and values. This helps with readability when a dataplane has multiple tags applied to it.
* feat: New TrafficTrace entity detail and list views [[#12](https://github.com/kumahq/kuma-gui/pull/12)] 👍 contributed by @jakubdyszkiewicz

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
