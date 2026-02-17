---
time: ~8 minutes
tokens: ~150,000
---

## Prompts

> We currently use lots of SASS CSS variables throughout our codebase, I'd like to migrate off of these and use native CSS properties instead. The approach I thought of was to use our XTheme component to define a CSS property for every SASS variable we use so for example `$kui-font-size-100` would become `--x-font-size-100: $kui-font-size-100`. Then within our app we could use `var(--x-font-size-100)` instead of `$kui-font-size-100`.
>
> Inside XTheme you will already find a `:deep(> *)` selector which will apply the new CSS properties to everything within the XTheme component, but its probably best to make a new CSS rule using the exact same selector to separate these sorts of CSS properties form the ones that already exist. Doing this will also make it easier for me to review the changes.

> I would also like you to replace any existing $kui-usages in the codebase.

> Keep SASS vars for usages outside XTheme scope (`:root` level, unscoped tooltip styles).

---

# Migrate SASS variables to CSS custom properties via XTheme

## Context

The codebase uses ~60 SASS variables from `@kong/design-tokens` (`$kui-*`) across ~70 files. These are compile-time values. The goal is to expose each as a native CSS custom property through XTheme, then replace all usages within XTheme's scope with `var(--x-*)`.

## Step 1: Add CSS custom property definitions to XTheme

**File:** `packages/x/src/components/x-theme/XTheme.vue`

Add a **new** `:deep(> *)` rule block at the end of the `<style lang="scss" scoped>` section with a `& { ... }` rule defining all `--x-*` properties:

```scss
:deep(> *) {
  & {
    /* animation */
    --x-animation-duration-20: #{$kui-animation-duration-20};

    /* border-radius */
    --x-border-radius-10: #{$kui-border-radius-10};
    --x-border-radius-20: #{$kui-border-radius-20};
    --x-border-radius-30: #{$kui-border-radius-30};
    --x-border-radius-40: #{$kui-border-radius-40};

    /* border-width */
    --x-border-width-10: #{$kui-border-width-10};

    /* color-background */
    --x-color-background: #{$kui-color-background};
    --x-color-background-inverse: #{$kui-color-background-inverse};
    --x-color-background-neutral-weaker: #{$kui-color-background-neutral-weaker};
    --x-color-background-neutral-weakest: #{$kui-color-background-neutral-weakest};
    --x-color-background-primary: #{$kui-color-background-primary};
    --x-color-background-primary-weakest: #{$kui-color-background-primary-weakest};
    --x-color-background-success-weakest: #{$kui-color-background-success-weakest};
    --x-color-background-warning-weak: #{$kui-color-background-warning-weak};

    /* color-border */
    --x-color-border: #{$kui-color-border};
    --x-color-border-primary: #{$kui-color-border-primary};
    --x-color-border-primary-strong: #{$kui-color-border-primary-strong};
    --x-color-border-primary-weak: #{$kui-color-border-primary-weak};

    /* color-text */
    --x-color-green-40: #{$kui-color-green-40};
    --x-color-text: #{$kui-color-text};
    --x-color-text-danger: #{$kui-color-text-danger};
    --x-color-text-decorative-aqua: #{$kui-color-text-decorative-aqua};
    --x-color-text-disabled: #{$kui-color-text-disabled};
    --x-color-text-inverse: #{$kui-color-text-inverse};
    --x-color-text-neutral: #{$kui-color-text-neutral};
    --x-color-text-neutral-strong: #{$kui-color-text-neutral-strong};
    --x-color-text-primary: #{$kui-color-text-primary};

    /* font-family */
    --x-font-family-code: #{$kui-font-family-code};
    --x-font-family-text: #{$kui-font-family-text};

    /* font-size */
    --x-font-size-20: #{$kui-font-size-20};
    --x-font-size-30: #{$kui-font-size-30};
    --x-font-size-40: #{$kui-font-size-40};
    --x-font-size-50: #{$kui-font-size-50};
    --x-font-size-60: #{$kui-font-size-60};
    --x-font-size-70: #{$kui-font-size-70};

    /* font-weight */
    --x-font-weight-bold: #{$kui-font-weight-bold};
    --x-font-weight-medium: #{$kui-font-weight-medium};
    --x-font-weight-regular: #{$kui-font-weight-regular};
    --x-font-weight-semibold: #{$kui-font-weight-semibold};

    /* icon-size */
    --x-icon-size-30: #{$kui-icon-size-30};
    --x-icon-size-40: #{$kui-icon-size-40};

    /* line-height */
    --x-line-height-20: #{$kui-line-height-20};
    --x-line-height-30: #{$kui-line-height-30};
    --x-line-height-40: #{$kui-line-height-40};

    /* shadow */
    --x-shadow-border: #{$kui-shadow-border};
    --x-shadow-border-primary: #{$kui-shadow-border-primary};
    --x-shadow-border-primary-strongest: #{$kui-shadow-border-primary-strongest};
    --x-shadow-border-primary-weak: #{$kui-shadow-border-primary-weak};
    --x-shadow-focus: #{$kui-shadow-focus};

    /* spacing */
    --x-space-10: #{$kui-space-10};
    --x-space-20: #{$kui-space-20};
    --x-space-30: #{$kui-space-30};
    --x-space-40: #{$kui-space-40};
    --x-space-50: #{$kui-space-50};
    --x-space-60: #{$kui-space-60};
    --x-space-70: #{$kui-space-70};
    --x-space-80: #{$kui-space-80};
    --x-space-90: #{$kui-space-90};
    --x-space-100: #{$kui-space-100};
    --x-space-110: #{$kui-space-110};
  }
}
```

## Step 2: Replace $kui-* usages across the codebase

Every `$kui-*` usage within XTheme's scope gets replaced with `var(--x-*)`. The replacement patterns:

| SASS usage | CSS replacement |
|---|---|
| `$kui-space-40` | `var(--x-space-40)` |
| `#{$kui-color-text-neutral}` | `var(--x-color-text-neutral)` |
| `calc(0px - $kui-space-60)` | `calc(0px - var(--x-space-60))` |

### Files that KEEP $kui-* (outside XTheme scope)

- `packages/kuma-gui/src/assets/styles/_variables.scss` — `:root` level, outside XTheme's cascade
- `packages/x/src/components/x-theme/XTheme.vue` — defines the CSS custom properties themselves
- `packages/x/src/components/x-icon/XIcon.vue` lines 161-168 — unscoped style block targeting teleported tooltips

### Files to update (grouped by package)

#### SCSS global styles (3 files)

- `packages/kuma-gui/src/assets/styles/_base.scss`
- `packages/kuma-gui/src/assets/styles/_components.scss`
- `packages/kuma-gui/src/assets/styles/_mixins.scss`

#### x package components (19 files)

- `packages/x/src/components/x-about-card/XAboutCard.vue`
- `packages/x/src/components/x-action/XAction.vue`
- `packages/x/src/components/x-action-group/XActionGroup.vue`
- `packages/x/src/components/x-alert/XAlert.vue`
- `packages/x/src/components/x-card/XCard.vue`
- `packages/x/src/components/x-code-block/XCodeBlock.vue`
- `packages/x/src/components/x-copy-button/XCopyButton.vue`
- `packages/x/src/components/x-dl/XDl.vue`
- `packages/x/src/components/x-drawer/XDrawer.vue`
- `packages/x/src/components/x-empty-state/XEmptyState.vue`
- `packages/x/src/components/x-icon/XIcon.vue` (scoped block only, lines 117-160)
- `packages/x/src/components/x-input/XInput.vue`
- `packages/x/src/components/x-layout/XLayout.vue`
- `packages/x/src/components/x-prompt/XPrompt.vue`
- `packages/x/src/components/x-radio/XRadio.vue`
- `packages/x/src/components/x-search/XSearch.vue`
- `packages/x/src/components/x-select/XSelect.vue`
- `packages/x/src/components/x-table/XTable.vue`
- `packages/x/src/components/x-tabs/XTabs.vue`

#### kuma-gui app components (30 files)

- `packages/kuma-gui/src/app/application/components/app-collection/AppCollection.vue`
- `packages/kuma-gui/src/app/application/components/app-navigator/AppNavigator.vue`
- `packages/kuma-gui/src/app/application/components/app-view/AppView.vue`
- `packages/kuma-gui/src/app/common/AccordionItem.vue`
- `packages/kuma-gui/src/app/common/data-card/DataCard.vue`
- `packages/kuma-gui/src/app/common/DefinitionCard.vue`
- `packages/kuma-gui/src/app/common/ResourceStatus.vue`
- `packages/kuma-gui/src/app/common/StatusBadge.vue`
- `packages/kuma-gui/src/app/common/TagList.vue`
- `packages/kuma-gui/src/app/common/TargetRef.vue`
- `packages/kuma-gui/src/app/connections/components/connection-traffic/ConnectionCard.vue`
- `packages/kuma-gui/src/app/connections/components/connection-traffic/ConnectionGroup.vue`
- `packages/kuma-gui/src/app/connections/components/connection-traffic/ConnectionTraffic.vue`
- `packages/kuma-gui/src/app/control-planes/components/ControlPlaneStatus.vue`
- `packages/kuma-gui/src/app/control-planes/views/ControlPlaneDetailView.vue`
- `packages/kuma-gui/src/app/data-planes/views/DataPlaneDetailView.vue`
- `packages/kuma-gui/src/app/data-planes/views/DataPlaneListView.vue`
- `packages/kuma-gui/src/app/gateways/components/ListenerRoutes.vue`
- `packages/kuma-gui/src/app/gateways/views/BuiltinGatewayDataplanesView.vue`
- `packages/kuma-gui/src/app/gateways/views/DelegatedGatewayDetailView.vue`
- `packages/kuma-gui/src/app/kuma/components/ApplicationShell.vue`
- `packages/kuma-gui/src/app/legacy-data-planes/components/BuiltinGatewayPolicies.vue`
- `packages/kuma-gui/src/app/legacy-data-planes/views/DataPlaneDetailView.vue`
- `packages/kuma-gui/src/app/meshes/views/MeshDetailView.vue`
- `packages/kuma-gui/src/app/policies/components/PolicyTypeEntryList.vue`
- `packages/kuma-gui/src/app/policies/views/PolicyListView.vue`
- `packages/kuma-gui/src/app/policies/views/PolicyTypeListView.vue`
- `packages/kuma-gui/src/app/rules/components/RuleFilter.vue`
- `packages/kuma-gui/src/app/rules/components/RuleList.vue`
- `packages/kuma-gui/src/app/rules/components/RuleMatch.vue`
- `packages/kuma-gui/src/app/rules/components/RuleMatchers.vue`
- `packages/kuma-gui/src/app/services/views/MeshExternalServiceDetailView.vue`
- `packages/kuma-gui/src/app/services/views/MeshMultiZoneServiceDetailView.vue`
- `packages/kuma-gui/src/app/services/views/MeshServiceDetailView.vue`
- `packages/kuma-gui/src/app/services/views/ServiceDetailView.vue`
- `packages/kuma-gui/src/app/zone-egresses/views/ZoneEgressDetailView.vue`
- `packages/kuma-gui/src/app/zone-ingresses/views/ZoneIngressDetailView.vue`
- `packages/kuma-gui/src/app/zones/views/ZoneDetailView.vue`
- `packages/kuma-gui/src/app/zones/views/ZoneListView.vue`

## Verification

1. Run the project build to confirm SASS compilation succeeds
2. Run the dev server and inspect elements in DevTools — confirm `--x-*` properties are visible and values are correct
3. Run existing tests to ensure no regressions
4. Visually spot-check key pages (e.g. mesh list, data plane detail, policy list) for styling consistency
