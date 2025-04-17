# x-timespan

Presentational component for showing spans of time.

Attributes are purposefully simple strings, please pass in a correctly formatted date using `t('common.formats.datetime', { value: yourDateVariable })`

Both attributes are optional for specifying a single time, and all content of the component is end-aligned. Content will wrap before the values rather than in the middle of the values when space is restricted.

<Story>
  <XTimespan
    start="Christmas"
    end="New Year"
  />
  <XTimespan
    start="Christmas"
    :end="t('common.formats.datetime', { value: '1' })"
  />
  <br />
  <XTimespan
    :start="t('common.formats.datetime', { value: '1' })"
  />
  <br />
  <XTimespan
    :end="t('common.formats.datetime', { value: '1' })"
  />
  <br />
  <figure
    style="width: 200px;float: right;"
  >
    <XTimespan
      :start="t('common.formats.datetime', { value: '1' })"
      :end="t('common.formats.datetime', { value: '2' })"
    />
  </figure>
</Story>
