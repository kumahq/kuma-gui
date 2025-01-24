# XAction

XAction should be used for all user interactions. **Both** links/anchors and buttons.

The correct semantic HTML element will be used depending on whether you pass
the `XAction` a `to`/`href` or a `@click` event.

`XAction`s are rendered as `KButton`s by using a KButton `appearance` attribute.

<Story height="320">
  <XAction
    href="http://github.com/kumahq/kuma-gui"
  >
    External link to Github Repo
  </XAction>
  <hr
    v-style="'margin: 20px auto'"
  />
  <XAction
    @click="() => console.log('Hi')"
  >
    Native Button that `console.log`s `Hi` on click
  </XAction>
  <hr
    v-style="'margin: 20px auto'"
  />
  <div
    v-style="'display: grid;gap: 20px;grid-template-columns: repeat(2, calc(50% - 10px))'"
  >
    <XAction
      appearance="primary"
      @click="() => console.log('Hi')"
    >
      Primary KButton
    </XAction>
    <XAction
      appearance="secondary"
      :to="{ name: '' }"
    >
      Secondary KButton
    </XAction>
    <XAction
      appearance="tertiary"
      @click="() => console.log('Hi')"
    >
      Tertiary KButton
    </XAction>
    <XAction
      appearance="danger"
      @click="() => console.log('Hi')"
    >
      Danger KButton
    </XAction>

  </div>
</Story>
