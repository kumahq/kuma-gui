# @kumahq/data

External data fetching, loading and error handling components

See `./src/vue/components/README.md` for more details on `<DataSource />`,
`<DataLoader />` and `<DataSink />`.

## Components

- **DataLoader** - Blocking data loader that wraps DataSource and manages
loading, connecting, and error states across one or more data sources.
- **DataSink** - Writable data component that manages submission payloads and
emits change/error events on write operations.
- **DataSource** - Non-blocking data fetcher that loads data from a URI and
emits change and error events, with automatic cleanup via AbortController.
