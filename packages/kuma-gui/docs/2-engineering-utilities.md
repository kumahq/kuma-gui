---
section: Overview
---
# Engineering Utilities

## Environment/Cookie Variables

During development, all 'environment variables' can be edited by adding/editing
your cookies via your browsers Web Inspector > Application > Cookies panel.

For example if you want to enable a kubernetes environment so that using
`env('KUMA_ENVIRONMENT')` returns 'kubernetes', go to your browsers Web
Inspector > Application > Cookies panel and enter:

| Name | Value |
| ---- | ----- |
| KUMA_ENVIRONMENT | kubernetes |

_Any_ `KUMA_*` environment variable can be changed like this to quickly and
easily set up scenarios to help you build, check and test features.

::: warning
Using cookies to set environment variables only works during development and PR
previews. **It will not work during production** i.e. once the GUI has been
built for embedding in the kuma binary.
:::

### Bookmarklets

For commonly used 'scenarios' its useful to use browser bookmarklets to help
you to setup scenarios with a single click.

The first link in the below table can be dragged to your bookmark bar. When you
click it it will give you both a link for sharing or adding to PR descriptions
with your current cookie settings and a draggable link that you can drag to
your bookmark bar and rename for future use.

The other links are some common bookmarklets that are handy to use, but please
make your own and if any become really common feel free to add here.

| Bookmarklet | Description |
| ---- | ----- |
| <a href="javascript:(function()%7B(()%3D%3E%7Bconst%20prefix%3D'KUMA_'%3Bconst%20str%3Ddocument.cookie.split('%3B').map((item)%3D%3Eitem.trim()).filter((item)%3D%3Eitem!%3D%3D'').filter((item)%3D%3Eitem.split('%3D').shift().startsWith(prefix)).join('%3B')%3Bconst%20tab%3Dwindow.open(''%2C%20'_blank')%3Btab.document.write(%60%3Cbody%3E%3Cpre%3E%24%7Blocation.href%7D%23%24%7Bstr%7D%3C%2Fpre%3E%3Cbr%20%2F%3E%3Ca%20href%3D&quot;javascript%3A(function()%257B((str)%253D%253E%257Bstr.split('%253B').map((item)%253D%253Eitem.trim()).filter((item)%253D%253Eitem!%253D%253D'').forEach((item)%253D%253E%257Bdocument.cookie%2520%253D%2520%2560%2524%257Bitem%257D%253BPath%253D%252F%2560%253B%257D)%253Blocation.reload()%253B%257D)('%24%7Bstr%7D')%257D)()%253B&quot;%3EScenario%3C%2Fa%3E%3C%2Fbody%3E%60)%3B%7D)()%7D)()%3B">* Create Scenario</a> | Creates a new bookmarklet and link from your current cookies for dragging to your bookmark bar |
| --- | --- |
| <a href="javascript:(function()%7B((str)%3D%3E%7Bstr.split('%3B').map((item)%3D%3Eitem.trim()).filter((item)%3D%3Eitem!%3D%3D'').forEach((item)%3D%3E%7Bdocument.cookie%20%3D%20%60%24%7Bitem%7D%3BPath%3D%2F%60%3B%7D)%3Blocation.reload()%3B%7D)('KUMA_MOCK_API_ENABLED=false')%7D)()%3B">Disable Mocking</a>| Turn off HTTP API mocking by using `KUMA_MOCK_API_ENABLED=false`. HTTP requests will be sent to a locally running kuma installation at http://localhost:5681 |
| <a href="javascript:(function()%7B((str)%3D%3E%7Bstr.split('%3B').map((item)%3D%3Eitem.trim()).filter((item)%3D%3Eitem!%3D%3D'').forEach((item)%3D%3E%7Bdocument.cookie%20%3D%20%60%24%7Bitem%7D%3BPath%3D%2F%60%3B%7D)%3Blocation.reload()%3B%7D)('KUMA_ENVIRONMENT=kubernetes')%7D)()%3B">Environment: kubernetes</a>| Set the `KUMA_ENVIRONMENT` to `kubernetes` |
| <a href="javascript:(function()%7B((str)%3D%3E%7Bstr.split('%3B').map((item)%3D%3Eitem.trim()).filter((item)%3D%3Eitem!%3D%3D'').forEach((item)%3D%3E%7Bdocument.cookie%20%3D%20%60%24%7Bitem%7D%3BPath%3D%2F%60%3B%7D)%3Blocation.reload()%3B%7D)('KUMA_ENVIRONMENT=universal')%7D)()%3B">Environment: kubernetes</a>| Set the `KUMA_ENVIRONMENT` to `universal` |
| <a href="javascript:(function()%7B((str)%3D%3E%7Bstr.split('%3B').map((item)%3D%3Eitem.trim()).filter((item)%3D%3Eitem!%3D%3D'').forEach((item)%3D%3E%7Bdocument.cookie%20%3D%20%60%24%7Bitem%7D%3BPath%3D%2F%60%3B%7D)%3Blocation.reload()%3B%7D)('KUMA_MODE=standalone')%7D)()%3B">Disable Zones</a>| Set the `KUMA_MODE` to `standalone` i.e. disable `zones` and only use a non-federated kuma with only Zone Egress |
| <a href="javascript:(function()%7B((str)%3D%3E%7Bstr.split('%3B').map((item)%3D%3Eitem.trim()).filter((item)%3D%3Eitem!%3D%3D'').forEach((item)%3D%3E%7Bdocument.cookie%20%3D%20%60%24%7Bitem%7D%3BPath%3D%2F%60%3B%7D)%3Blocation.reload()%3B%7D)('KUMA_MODE=global')%7D)()%3B">Enable Zones</a>| Set the `KUMA_MODE` to `global` i.e. enable `zones` and use a federated kuma with Zone support |
| <a href="javascript:(function()%7B((str)%3D>%7Bstr.split('%3B').map((item)%3D>item.trim()).filter((item)%3D>item!%3D%3D'').forEach((item)%3D>%7Bdocument.cookie %3D %60%24%7Bitem%7D%3BPath%3D%2F%60%3B%7D)%3Blocation.reload()%3B%7D)('KUMA_I18N_DEBUG_ENABLED=1')%7D)()%3B">Debug i18n strings</a>| Show i18n keys instead of strings |
| <a href="javascript:(function()%7B((str)%3D>%7B%0Astr.split('%3B').map((item)%3D>item.trim()).filter((item)%3D>item!%3D%3D'').forEach((item)%3D>%7B%0Adocument.cookie %3D %60%24%7Bitem.replace('%25s'%2C prompt(item%2C 3000))%7D%3BPath%3D%2F%60%3B%0A        %7D)%3B%0A        location.reload()%3B%0A%7D)('KUMA_LATENCY%3D%25s')%7D)()%3B">Latency: 3000</a>| Set the HTTP API latency (defaults to 3000ms) |

::: tip
There are very many `KUMA_<resource-type>_COUNT` variables to allow you to
control the amount of data returned by the HTTP API. Using for example
`KUMA_MESH_COUNT=0` is useful for viewing empty states.
:::


## `debug` service containers

Some modules use `debug` (`debug.ts`) service containers to inject
debug/engineering utilities to make debugging easier, for example:

- Our mocks are injected via `debug` containers.
- Clicking copy buttons will also print what is copied to `console`


