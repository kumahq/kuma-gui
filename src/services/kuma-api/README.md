# kuma-api

The `KumaApi` service contains all the methods for calling Kuma HTTP API methods
via a `fetch` based HTTP client.

This service is currently available via:

```javascript
import { useKumaApi } from '@/utilities'
const kumaApi = useKumaApi()
kumaApi.getConfig()
```
