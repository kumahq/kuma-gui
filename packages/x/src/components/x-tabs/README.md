# x-tabs

Tab-looking navigation links

XTabs purposefully only works with anchors. If you try to use something else
the design/styles will _not be applied_. The only other element you can use is a
`span` which is used for a _disabled_ link (a disabled link is a piece of text).


```
<XTabs
  selected="the-selected-slot"
>
  <template
    #disabled-tab
  >

    <span>
      Disabled Tab
    </span>
  </template>
  <template
    #linked-tab
  >
    <XAction
      :to="{ name }"
    >
      Link Tab
    </XAction>
  </template>
  <template
    #the-selected-slot-tab
  >
    <XAction
      :to="{ name }"
    >
      Selected Tab
    </XAction>
  </template>
</XTabs>
```
