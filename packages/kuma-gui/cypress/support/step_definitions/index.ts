import { setupDefinitions } from '@kumahq/config/cypress/definitions'

import { useMock, useClient } from '../../services'

const mock = useMock()
const client = useClient()

setupDefinitions({ mock, client })
