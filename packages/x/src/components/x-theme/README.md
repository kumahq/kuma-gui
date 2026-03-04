# x-theme

XTheme is a design token distribution component that wraps the application and
provides CSS custom properties (`--x-*`) and an icon system to all descendant
components.

It bridges Kong UI SASS design tokens (`$kui-*`) into native CSS custom
properties, enabling runtime theming and better DevTools inspectability. It
also provides a CSS-animation-based icon rendering system for Kuma-specific
entity icons.

Having colors and icons specified in XTheme allows nestable runtime theming of
all design tokens and icons in a centralized place.

## Usage

Wrap your application (or a subtree) with `XTheme`. It accepts no props and
exposes a single default slot:

```vue
<template>
  <XTheme>
    ...
  </XTheme>
</template>
```

All descendants can then use `var(--x-*)` tokens in their styles:

```scss
.my-component {
  padding: var(--x-space-40);
  font-size: var(--x-font-size-50);
  color: var(--x-color-text-primary);
  border-radius: var(--x-border-radius-20);
}
```

### Base styles

XTheme sets the following base styles on all direct children:

```scss
font-size: var(--x-font-size-40);
color: var(--x-color-text);
font-family: var(--x-font-family-text);
font-weight: var(--x-font-weight-regular);
```

## Design tokens

All tokens follow the naming convention `--x-{category}-{scale}`, mapped from
the corresponding `$kui-*` SASS variable.

## Icon system

XTheme provides a CSS-animation-based icon system using `::before` and
`::after` pseudo-elements. Icons are rendered via paused CSS animations that
apply mask/background images on `animation-fill-mode: forwards`.

`v-icon-start` and `v-icon-end` Vue directives are available and are the
recommended way to add icons in this way. But depending on the use case XTheme
allows you to use inline styles or also native CSS rules to add iconography.

See below for more information.

### Available icons

A non-exhaustive list of available icons:

**Example modern icons** (SVG, mask-based, inherits `currentColor`):

`wifi-tethering`, `home`, `zone`, `mesh`, `zone-egress`, `configuration`,
`workload`, `dataplane-standard`, `dataplane-builtin`, `dataplane-delegated`,
`subscription`, `policy`, `mesh-identity`, `mesh-trust`

**Example legacy icons** (PNG, background-image-based):

`circuitbreaker`, `faultinjection`, `healthcheck`, `proxytemplate`,
`ratelimit`, `retry`, `timeout`, `trafficlog`, `trafficpermission`,
`trafficroute`, `traffictrace`, `virtualoutbound`

### Using icons with directives

The recommended way to add icons is through the `v-icon-start` and `v-icon-end`
directives (see ../../directives/icon):

```vue
<button
  v-icon-start="'home'"
>
  Home
</button>
<a
  v-icon-end="'mesh'"
>
  View Mesh
</a>
```

You can also pass an object for more control over size:

```vue
<span
  v-icon-start="{ name: 'zone', size: '40' }"
>
  Zone
</span>
```

See ../../directives/icon for more details.

### Using icons with v-style

Alternatively, when necessary you can also set the icon CSS custom properties
directly with the `v-style` directive:

```vue
<span
  v-style="'--icon-name-start: var(--icon-mesh)'"
>
  Mesh
</span>
```

As a last resort and when necessary you can also set icons using a slightly
more verbose approach:

```
.my-component::before {
  content: '';
  animation-name: var(--icon-name-start), icon-size-40;
}
```

### Icon CSS custom properties

| Property | Description |
|---|---|
| `--icon-name-start` | Icon animation name for `::before` |
| `--icon-name-end` | Icon animation name for `::after` |
| `--icon-size-start` | Icon size animation for `::before` (default: `icon-size-30`) |
| `--icon-size-end` | Icon size animation for `::after` (default: `icon-size-30`) |
| `--icon-size` | Fallback icon size for both positions |
| `--icon-color` | Override icon color (defaults to `currentColor`) |
| `--icon-color-start` | Override color for `::before` icon |
| `--icon-color-end` | Override color for `::after` icon |
| `--icon-space-before` | Spacing before the icon |
| `--icon-space-after` | Spacing after the icon |
