# Routing

In out application, documents (or views) are associated with URL paths using [vue-router](https://router.vuejs.org/). Every view has its own URL. Most views are representations of a resource (e.g. `/meshes` is a list of meshes, `/meshes/default` is a detail of the default mesh, `/meshes/default/services` is a list of services in the mesh “default”, etc.).

## How to set-up module routes

::: tip
Learn more about [Modules](/docs/modules.md)
:::

To create a consistent set of URLs for our application, we follow a couple of rules. One key objective is to make sure that views in their current state have robust URLs (i.e. I can send you the URL of the Data Plane Proxy list view filtered by name “demo” on page 2 and that same state is restored when you access that URL).

### Naming

Each route definition has a path segment. All path segments are lowercase and dash-delimited. Resource names are plural (if there can be multiple instances of that resource).

An example of route paths and their associated views based on the rules laid out below:

| Path                                    | View                          |
|-----------------------------------------|-------------------------------|
| `/meshes`                               | List                          |
| `/meshes/-create`                       | Create                        |
| `/meshes/:mesh`                         | List (with selected resource) |
| `/meshes/:mesh/-update`                 | Update                        |
| `/meshes/:mesh/overview`                | Detail (overview)             |

### List

**Example**: `/meshes`

For a resource list, the path segment is the plural variant of the resource name (e.g. `Mesh` → `/meshes`).

::: tip NOTE
We do stretch this rule occasionally. For example, the service list view is populated using `ServiceInsight` objects and its path segment is `/services` (not `/service-insights`).
:::

### Create

**Example**: `/meshes/-create`

For a create view, a single static path segment `/-create` is used.

::: tip WARNING
A create view route (e.g. `/meshes/-create`) **must** be defined before routes for list views with a selected resource (e.g. `/meshes/default`) to make sure the create view route is matched first.
:::

::: tip NOTE
The path segment is chosen to be an invalid DNS name (which can’t start with a `-` character). This ensures the path is unambiguous and doesn’t conflict with a resource of the same name (e.g. a resource called `create`).
:::

### List with selected resource

**Example**: `/meshes/:mesh`

For a resource list that allows selecting an individual resource in order to display a kind of summary, a single dynamic path segment is used. This segment is dynamic and is either the unique name of a resource or the unique ID of a resource.

### Detail

**Example**: `/meshes/:mesh/overview`

For a resource detail, two path segments are used. Detail views **must** be defined as child routes of the corresponding list view unless the resource only exists once (and so a list view doesn’t exist for it in the first place).

The first path segment is dynamic and is either the unique name of a resource or the unique ID of a resource.

The second path segment is static and should describe the kind of resource detail as there can be multiple detail views for a single resource. It should be a noun. For the default/main detail view, we usually use `/overview`.

### Update

**Example**: `/meshes/:mesh/-update`

For an update view, a single static path segment `/-update` is used.
