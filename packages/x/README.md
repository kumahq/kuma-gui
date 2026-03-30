# @kumahq/x

Application level UI components.

'x' components are generally 'thin wrappers' over either native Vue
components or [Kongponents](https://kongponents.konghq.com/) to make them
easier to work with.


For example:

- `XAction`: Use these for `<a>`s or `<button>`s. They wrap Vue's `RouterLink`.
- `XTeleportTemplate`/`XTeleportSlot`: Use these for rendering things in a
  different place to where you are writing it. They wrap Vue's `Teleport`.
- `XTabs`: Basic tab navigation. They wrap `KTabs`.
- ...

## Components

- **[XAboutCard](./src/components/x-about-card)** - Displays entity about-information with formatted timestamps.
- **[XAction](./src/components/x-action)** - Renders as a button, link, or router-link depending on context. ([RouterLink](https://router.vuejs.org/api/components/router-link.html))
- **[XActionGroup](./src/components/x-action-group)** - Dropdown action menu that expands to a button group in wider layouts.
- **[XAlert](./src/components/x-alert)** - Dismissible alert notification message. ([KAlert](https://kongponents.konghq.com/components/alert.html))
- **[XAnonymous](./src/components/x-anonymous)** - Transparent wrapper that only renders its slot content.
- **[XBadge](./src/components/x-badge)** - Status badge with optional icon. ([KBadge](https://kongponents.konghq.com/components/badge.html))
- **[XBreadcrumbs](./src/components/x-breadcrumbs)** - Navigation breadcrumb trail. ([KBreadcrumbs](https://kongponents.konghq.com/components/breadcrumbs.html))
- **[XCard](./src/components/x-card)** - Contextual card container with action-aware styling. ([KCard](https://kongponents.konghq.com/components/card.html))
- **[XCheckbox](./src/components/x-checkbox)** - Checkbox input with slot support. ([KCheckbox](https://kongponents.konghq.com/components/checkbox.html))
- **[XCodeBlock](./src/components/x-code-block)** - Syntax-highlighted code viewer with optional editing support.
- **[XCopyButton](./src/components/x-copy-button)** - Copy-to-clipboard button with optional custom formatting. ([KCopy](https://kongponents.konghq.com/components/copy.html))
- **[XCopyButtonDebug](./src/components/x-copy-button)** - Debug variant of XCopyButton that logs copied text to the console.
- **[XDisclosure](./src/components/x-disclosure)** - Expandable/collapsible content toggle. ([KToggle](https://kongponents.konghq.com/components/toggle.html))
- **[XDl](./src/components/x-dl)** - Definition list with an optional inline stack variant.
- **[XDownload](./src/components/x-download)** - Provides a download helper function with automatic blob URL cleanup.
- **[XDrawer](./src/components/x-drawer)** - Slide-out side panel with title teleport support. ([KSlideout](https://kongponents.konghq.com/components/slideout.html))
- **[XEmptyState](./src/components/x-empty-state)** - Empty state display with icon mapping and i18n support. ([KEmptyState](https://kongponents.konghq.com/components/empty-state.html))
- **[XErrorState](./src/components/x-error-state)** - Contextual error display, adapting to modal or standalone layouts.
- **[XI18n](./src/components/x-i18n)** - Safe HTML template rendering with ICU message format and teleport slots.
- **[XIcon](./src/components/x-icon)** - Icon renderer with optional tooltip and policy role indicators.
- **[XInput](./src/components/x-input)** - Text input with optional debounce and search variant. ([KInput](https://kongponents.konghq.com/components/input.html))
- **[XInputSwitch](./src/components/x-input-switch)** - Toggle switch component. ([KInputSwitch](https://kongponents.konghq.com/components/input-switch.html))
- **[XLayout](./src/components/x-layout)** - Flexible layout system supporting stack, column, and action-group variants.
- **[XModal](./src/components/x-modal)** - Modal dialog with cancel event support. ([KModal](https://kongponents.konghq.com/components/modal.html))
- **[XNotification](./src/components/x-notification)** - Notification banner or toast with deduplication via XNotificationHub.
- **[XNotificationHub](./src/components/x-notification)** - Provider that manages banner and toast notifications with deduplication.
- **[XProgress](./src/components/x-progress)** - Loading indicator supporting spinner, skeleton, and line variants.
- **[XPrompt](./src/components/x-prompt)** - Confirmation dialog with action and cancel events. ([KPrompt](https://kongponents.konghq.com/components/prompt.html))
- **[XProvider](./src/components/x-provider)** - Service provider using Vue's inject/provide pattern.
- **[XRadio](./src/components/x-radio)** - Radio button with card variant support. ([KRadio](https://kongponents.konghq.com/components/radio.html))
- **[XSearch](./src/components/x-search)** - Search input with filter dropdown validation.
- **[XSelect](./src/components/x-select)** - Select dropdown with slot-based option rendering. ([KSelect](https://kongponents.konghq.com/components/select.html))
- **[XTable](./src/components/x-table)** - Semantic table wrapper with key-value variant support.
- **[XTabs](./src/components/x-tabs)** - Tab navigation with custom slot handling. ([KTabs](https://kongponents.konghq.com/components/tabs.html))
- **[XTimespan](./src/components/x-timespan)** - Displays timestamps
- **[XTeleportSlot](./src/components/x-teleport)** - Marks a teleport target location in the DOM. ([Teleport](https://vuejs.org/guide/built-ins/teleport.html))
- **[XTeleportTemplate](./src/components/x-teleport)** - Conditionally teleports content to a named XTeleportSlot. ([Teleport](https://vuejs.org/guide/built-ins/teleport.html))
- **[XTheme](./src/components/x-theme)** - Theme provider that exposes design tokens via CSS variables.
- **[XTooltip](./src/components/x-tooltip)** - Tooltip with customizable placement. ([KTooltip](https://kongponents.konghq.com/components/tooltip.html))
- **[XWindow](./src/components/x-window)** - Provides resize events via a slot by listening to window events.

## Directives

- **[vIcon](./src/directives/icon)** - Generates CSS variables for icon name and size properties.
- **[vStyle](./src/directives/style)** - Applies dynamic CSS style declarations from an object or string.
