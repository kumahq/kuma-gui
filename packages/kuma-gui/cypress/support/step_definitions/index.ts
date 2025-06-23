import { setupSteps } from '@kumahq/config/cypress/steps'

import { useMock, useClient } from '../../services'

const mock = useMock()
const client = useClient()

setupSteps({ mock, client })
