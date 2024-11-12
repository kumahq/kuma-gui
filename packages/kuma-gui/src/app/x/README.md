---
section: Packages
---
# x

Our application level UI components.

These 'x' components are generally 'thin wrappers' over either native Vue
components or Kongponents to make them easier to work with.

For example:

- `XAction`: Use these for `<a>`s or `<button>`s. They wrap Vue's `RouterLink`.
- `XTeleportTemplate`/`XTeleportSlot`: Use these for rendering things in a
  different place to where you are writing it. They wrap Vue's `Teleport`.
- `XTabs`: Basic tab navigation. They wrap `KTabs`.
- ...

