# XActionGroup

XAction group is to render/display groups of actions (i.e. XActions).

You can show the group as 'expanded' or 'not expanded' (i.e. a dropdown). By
default a not expanded group uses a meatball menu control to allow the user to
open the group. This can be customized via the `control` slot.

The below shows examples of each layout.

<Story height="340">
  <div style="display: grid;grid-template-columns: repeat(2, calc(50% -10px));gap: 20px;">
    <XActionGroup
      :expanded="false"
    >
      <XAction>One</XAction>
      <XAction>Two</XAction>
      <XAction>Three</XAction>
      <XAction appearance="danger">Four</XAction>
    </XActionGroup>
    <hr />
    <XActionGroup
      :expanded="true"
    >
      <XAction>One</XAction>
      <XAction>Two</XAction>
      <XAction>Three</XAction>
      <XAction>Four</XAction>
    </XActionGroup>
  </div>
</Story>
