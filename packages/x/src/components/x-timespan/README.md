# x-timespan

Presentational component for showing spans of time.

Both attributes are optional for specifying a single time.

> [!WARNING]
> XTimespan can only be used within an XCard, otherwise its a no-op.
> Additionally XTimespan should only be used once per XCard.

```vue
<XCard>
  <XTimespan
    start="Christmas"
    end="New Year"
  />
</XCard>
<XCard>
  <XTimespan
    start="Christmas"
    :end="1773923999322"
  />
</XCard>
<XCard>
  <XTimespan
    :start="1773923999322"
  />
</XCard>
<XCard>
  <XTimespan
    :end="1773923999322"
  />
</XCard>
```
