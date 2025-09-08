# x-search

The `XSearch` component is an input field that highlights `key:value` pairs and offers guidance through a dropdown that includes information about the searchable content.

<Story height="600">
  <search>
    <form>
      <XSearch
        name="search"
        :search-regex="/\S+/"
        placeholder="Filter by name, protocol, service or tag..."
        :default-value="route.params.search"
        :keys="['name', 'protocol', 'service', 'tag']"
      />
    </form>
  </search>
</Story>
