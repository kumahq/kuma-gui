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

### Common Use Cases

Quick reference for choosing the right variant:

- **Form layouts and Card stacks** → `y-stack` - Stack form fields vertically with consistent spacing
- **Button groups** → `x-stack` - Arrange action buttons horizontally
- **Label/badge lists** → `separated` - Display labels naturally `label-one, label-two, label-three`
- **Column layouts** → `columns` - Responsive side-by-side content

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
  <XBadge>label-1</XBadge>
  <XBadge>label-2</XBadge>
  <XBadge>label-3</XBadge>
  <XBadge>another-label</XBadge>
</XLayout>
```

### `columns` - Responsive Columns

Creates a responsive column layout. Columns will stack vertically on narrow
screens and display side-by-side when space allows.

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

## Truncate Feature

The `truncate` prop enables text truncation with ellipsis for the `separated`
variant. This is useful when displaying badges or tags in constrained spaces
like table cells.

> [!NOTE]
> Use `truncate` only in places where vertical space is limited, such as table
> rows and compact cards. The truncated content will scroll horizontally on hover.

```vue
<div>
  <XLayout variant="separated" truncate>
    <XBadge v-for="label in labels" :key="label">{{ label }}</XBadge>
  </XLayout>
</div>
```

