---
type: directive
---

# v-style

Replacement for HTML `style=""` for authors to use a declarative/config style
but use `el.style.setProperty` under-the-hood.

Additionally adds support via `v-style.next` (think `nextTick`) to transition
CSS properties easily.

<Story>
  <div
    v-style="'color: red'"
  >
    Text colored red
  </div>
  <div
    v-style="'padding: 10px;border: 1px solid red'"
  >
    Text with 10px padding and red border
  </div>
  <div
    v-style="{
      'color: red': true,
      'border: 1px solid blue': true,
      'padding: 100px': false,
    }"
  >
    Text colored red with a blue border but no padding
  </div>
  <div
    v-style="'transition: color 2s'"
    v-style.next="'color: red'"
  >
    Text colored normal transitioning to colored red
  </div>
</Story>
