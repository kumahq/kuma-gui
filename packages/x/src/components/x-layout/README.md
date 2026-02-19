# x-layout

A layout component for using common layout patterns as a component, rather than
relying on `<div>`s and CSS classes.

`XLayout` formalizes common layout patterns (vertical stacks, horizontal
layouts, badge lists, responsive columns) into a reusable component with
consistent spacing and alignment across the application.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | 'x-stack' \| 'y-stack' \| 'separated' \| 'columns'` | `''` | The layout pattern to use |
| `size` | `'small' \| 'normal' \| 'large' \| 'max'` | `'normal'` | Controls spacing/gap size (applies to most variants) |
| `justify` | `'start' \| 'around' \| 'between' \| 'end'` | `'start'` | Horizontal alignment (applies to `x-stack`, `separated`) |
| `truncate` | `boolean` | `false` | Enables truncation with ellipsis (only works with `separated` variant) |

## Variants

### `y-stack` - Vertical Stack

Stacks child elements vertically with consistent spacing between them. Ideal
for form fields, card lists, or any vertically-arranged content.

The `size` prop controls the vertical spacing between items:

```vue
<XLayout variant="y-stack">
  <XCard>First card in stack</XCard>
  <XCard>Second card in stack</XCard>
  <XCard>Third card in stack</XCard>
</XLayout>

<!-- With custom spacing -->
<XLayout variant="y-stack" size="large">
  <section>Section 1</section>
  <section>Section 2</section>
</XLayout>
```

### `x-stack` - Horizontal Stack

Displays children in a horizontal row using flexbox. Useful for button groups,
inline controls, or horizontal navigation.

The `size` prop controls the horizontal gap, and `justify` controls alignment.

```vue
<XLayout variant="x-stack">
  <XButton>Cancel</XButton>
  <XButton>Save</XButton>
</XLayout>

<!-- Right-aligned with custom spacing -->
<XLayout variant="x-stack" size="large" justify="end">
  <XButton>Action 1</XButton>
  <XButton>Action 2</XButton>
</XLayout>
```

### `separated` - Think comma-separated

Displays children inline with wrapping enabled. Perfect for badges, tags, or
any list of small items that should flow and wrap naturally.

`separated` should be used when you are laying out things that usually would
use a comma-separated list, for example `one, two, three` would use a separated
layout. For a real world example we use this layout a lot for labels
`label-one, label-two, label-three`. We use badges to display these labels and
they are not separated with commas, but `separated` describes this
relationship.

Think carefully about whether to use this layout or not. If the layout is a
horizontal stack "because design" you probably want `x-stack` whereas it's
"because separated list" then you probably want `separated`.

Even if the CSS rules used for each horizontal layout may be the same, the
semantic naming distinction is important.


```vue
<XLayout variant="separated">
  <XBadge>tag-1</XBadge>
  <XBadge>tag-2</XBadge>
  <XBadge>tag-3</XBadge>
  <XBadge>another-tag</XBadge>
</XLayout>

<!-- Nested example -->
<XLayout variant="y-stack">
  <h3>Labels</h3>
  <XLayout variant="separated">
    <XBadge>production</XBadge>
    <XBadge>critical</XBadge>
    <XBadge>monitored</XBadge>
  </XLayout>
</XLayout>
```

### `columns` - Responsive Columns

Creates a responsive column layout using the "switcher" pattern. Columns will
stack vertically on narrow screens and display side-by-side when space allows
(threshold: 40rem).

```vue
<XLayout variant="columns">
  <div>
    <h4>Column 1</h4>
    <p>Content for first column</p>
  </div>
  <div>
    <h4>Column 2</h4>
    <p>Content for second column</p>
  </div>
</XLayout>
```

### Default (no variant)

When no variant is specified, `XLayout` renders a plain `<div>` with the base
class. Use this when you need a semantic wrapper without specific layout
behavior.

```vue
<XLayout>
  <p>Just a plain div wrapper</p>
</XLayout>
```

## Size Prop

The `size` prop controls spacing between child elements:

- **`small`**: 4px gap (`x-stack`, `separated`) or 8px margin (`y-stack`)
- **`normal`**: 8px gap (`x-stack`, `separated`) or 16px margin (`y-stack`) - default
- **`large`**: 16px gap (`x-stack`, `separated`) or 24px margin (`y-stack`)
- **`max`**: Same as `between` for justify (used with `x-stack`, `separated`)

> Note: The `columns` variant uses a fixed gap of 16px and does not respond to the `size` prop.

## Justify Prop

The `justify` prop controls horizontal alignment for `x-stack` and `separated` variants:

- **`start`**: Align items to the start (default for most cases)
- **`end`**: Align items to the end (default when inside a `kv` table)
- **`between`**: Distribute items with space between them
- **`around`**: Distribute items with space around them

```vue
<!-- Space between items -->
<XLayout variant="x-stack" justify="between">
  <span>Left side</span>
  <span>Right side</span>
</XLayout>

<!-- Centered alignment -->
<XLayout variant="separated" justify="around">
  <XBadge>Badge 1</XBadge>
  <XBadge>Badge 2</XBadge>
</XLayout>
```

## Truncate Feature

The `truncate` prop enables text truncation with ellipsis for the `separated`
variant. This is useful when displaying badges or tags in constrained spaces
like table cells.

> [!NOTE]
> Use `truncate` only in places where vertical space is limited, such as table
> rows and compact cards. The truncated content will scroll horizontally on hover.

```vue
<!-- In a table cell or compact space -->
<div style="width: 200px;">
  <XLayout variant="separated" truncate>
    <XBadge v-for="tag in manyTags" :key="tag">{{ tag }}</XBadge>
  </XLayout>
</div>
```

## Common Use Cases

Quick reference for choosing the right variant:

- **Form layouts** → `y-stack` - Stack form fields vertically with consistent spacing
- **Button groups** → `x-stack` - Arrange action buttons horizontally
- **Tag/badge lists** → `separated` - Display tags that wrap naturally
- **Two-column layouts** → `columns` - Responsive side-by-side content
- **Card lists** → `y-stack` - Stack cards vertically with spacing
- **Toolbar items** → `x-stack` with `justify="between"` - Spread toolbar controls
- **Compact tag display** → `separated` with `truncate` - Tags in limited space
