# x-layout

Layout component for using our common layouts, as opposed to using `<div>`s and
classes.

We have several layouts that we commonly use to help standardize margins and
layout across the application. `XLayout` formalizes those into a component for
usage inline instead of relying on global styles/class names.

> [!NOTE]
> For the `truncate` prop please refer to the `XTruncate` docs.

<Story>
  <XLayout
    type="stack"
  >
    <XLayout
      type="separated"
    >
      <XBadge>This</XBadge>
      <XBadge>Is</XBadge>
      <XBadge>A</XBadge>
      <XBadge>List</XBadge>
      <XBadge>Of</XBadge>
      <XBadge>Separated</XBadge>
      <XBadge>Badges</XBadge>
      <XBadge>Using</XBadge>
      <XBadge>separated</XBadge>
    </XLayout>
    <XLayout
      type="stack"
    >
      <XCard>This is the first card in a stack</XCard>
      <XCard>This is the second card in a stack</XCard>
    </XLayout>
  </XLayout>
</Story>
