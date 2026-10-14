/** @typedef {import('stylelint').Config} Config */

import { stylelint } from '@kumahq/config'

/** @type {Config} */ const config = {
  ...stylelint({}),
}

export default config
