# kuma-api

The `KumaApi` service contains all the methods for calling Kuma HTTP API methods
via a `fetch` based HTTP client. All HTTP requests in the application should use
this service.

This service is currently available via:

```javascript
import { useKumaApi } from '@/utilities'
const kumaApi = useKumaApi()
kumaApi.getConfig()
```

