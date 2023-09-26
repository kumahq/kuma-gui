# I18n

i18n utilities for translation (machine to human as well as other languages) and
generally managing lots of dynamic strings. Backing functionality is provided
by <https://github.com/Kong/public-ui-components/tree/main/packages/core/i18n>

'Project global' _and_ component locales are currently stored as yaml files in
`src/locales/en-us/*`, but in the future we should be able to store locales
colocated alongside the components that use them.

The service includes a separate "debug" decorator to enable people (engineers,
tech writers etc.) to easily view the i18n keys used in the application and
then find the key they need to change. This can be enabled by adding a
`KUMA_I18N_DEBUG_ENABLED` cookie with any non-empty value e.g. '1'. Note:
This debug functionality is not available in production builds, but _is_
available in environments such as PR preview sites.

## Usage

```vue
// from within components

const { t } = useI18n()

// 'project global' text
{{ t('http.api.property.mtls') }}

```
