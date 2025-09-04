# XEmptyState

A lot of the time, generally when dealing with collections of data, you should
be using `DataCollection` instead of `XEmptyState`. `DataCollection` will
automatically show an `XEmptyState` when it detects that the collection of data
is empty.

`DataCollections` also have an `#empty` slot which allows you to pass in an
`XEmptyState`.

That being said, there are some cases where you'll need to use an `XEmptyState`
on its own.

`XEmptyState` has a very boring default state:

<Story>
  <XEmptyState />
</Story>

But it also has title and default slots to allow you to alter the text. Please
use semantic elements when changing the default state. You should use `p` tags
or `<XI18n path="i18n.path.to.markdown" />` for default/body content and the
correct level of `h*` tag for the title depending on your page and the
position/level of the empty state.

<Story>
  <XEmptyState>
    <template
      #title
    >
      <h2>A different empty state title</h2>
    </template>
    <p>
      Different empty state content/body
    </p>
  </XEmptyState>
</Story>
