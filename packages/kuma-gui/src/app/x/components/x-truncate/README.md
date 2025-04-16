# x-truncate

Abstraction over `KTruncate`.

> [!WARNING]
> Use only in places where space is limited vertically, such as table rows and `XAboutCard`s.

<Story height="200">
  <div style="width: 200px;">
    <XTruncate>
      <XBadge v-for="tag in ['foo', 'bar', 'baz', 'qux', 'quux', 'quz', 'quuz']">{{ tag }}</XBadge>
    </XTruncate>
  </div>
</Story>
