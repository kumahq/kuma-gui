# @kumahq/data

External data fetching, loading and error handling components

See `./src/vue/components/README.md` for more details on `<DataSource />`,
`<DataLoader />` and `<DataSink />`.

## Components

- **DataSource** - Non-blocking external data fetcher.
- **DataLoader** - Blocking data loader that can use DataSource data and
manages loading, connecting, and error states across one or more data sources.
- **DataSink** - Writing data component, the "save external data" cousin of
DataSource.
