<template>
  <RouteView
    :attrs="{
      class: 'is-fullscreen'
    }"
  >
    <AppView
      :fullscreen="true"
      :breadcrumbs="[]"
    >
      <template #title>
        <h1>
          <RouteTitle
            :title="t('zones.routes.create.title')"
            :render="true"
          />
        </h1>
      </template>

      <template #actions>
        <KButton
          appearance="outline"
          :to="{ name: 'zone-cp-list-view' }"
        >
          {{ t('zones.form.exit') }}
        </KButton>
      </template>

      <div class="form-content">
        <h1>{{ t('zones.routes.create.title') }}</h1>

        <div class="form-wrapper mt-4">
          <div>
            <KLabel
              for="zone-name"
              required
              :tooltip-attributes="{ placement: 'right'}"
            >
              {{ t('zones.form.nameLabel') }}

              <template #tooltip>
                {{ t('zones.form.name_tooltip') }}
              </template>
            </KLabel>

            <KInput
              id="zone-name"
              v-model="name"
              type="text"
              name="zone-name"
              data-testid="name-input"
              :disabled="zone !== null"
            />
          </div>

          <KButton
            appearance="creation"
            :icon="isChangingZone ? 'spinner' : 'plus'"
            :disabled="isCreateButtonDisabled"
            data-testid="create-zone-button"
            @click="createZone"
          >
            {{ t('zones.form.createZoneButtonLabel') }}
          </KButton>
        </div>

        <ErrorBlock
          v-if="errorState.error !== null"
          class="mt-4"
          :error="errorState.error"
          :badge-appearance="errorState.badgeAppearance"
          :icon="errorState.icon"
          data-testid="create-zone-error"
        >
          <p>{{ errorState.title }}</p>

          <template
            v-if="errorState.description"
            #message
          >
            <p>{{ errorState.description }}</p>
          </template>
        </ErrorBlock>

        <div
          v-if="zone !== null"
          class="form-wrapper mt-4"
          data-testid="connect-zone-instructions"
        >
          <div>
            <span class="k-input-label">
              {{ t('zones.form.environmentLabel') }} *
            </span>

            <div class="radio-button-group">
              <KRadio
                id="zone-environment-universal"
                v-model="environment"
                selected-value="universal"
                name="zone-environment"
                data-testid="environment-universal-radio-button"
              >
                {{ t('zones.form.universalLabel') }}
              </KRadio>

              <KRadio
                id="zone-environment-kubernetes"
                v-model="environment"
                selected-value="kubernetes"
                name="zone-environment"
                data-testid="environment-kubernetes-radio-button"
              >
                {{ t('zones.form.kubernetesLabel') }}
              </KRadio>
            </div>
          </div>

          <template v-if="environment === 'kubernetes'">
            <div>
              <span class="k-input-label">
                {{ t('zones.form.zoneIngressLabel') }} *
              </span>

              <div class="radio-button-group">
                <KInputSwitch
                  id="zone-ingress-enabled"
                  v-model="zoneIngressEnabled"
                  data-testid="ingress-input-switch"
                >
                  <template #label>
                    {{ t('zones.form.zoneIngressEnabledLabel') }}
                  </template>
                </KInputSwitch>
              </div>
            </div>

            <div>
              <span class="k-input-label">
                {{ t('zones.form.zoneEgressLabel') }} *
              </span>

              <div class="radio-button-group">
                <KInputSwitch
                  id="zone-egress-enabled"
                  v-model="zoneEgressEnabled"
                  data-testid="egress-input-switch"
                >
                  <template #label>
                    {{ t('zones.form.zoneEgressEnabledLabel') }}
                  </template>
                </KInputSwitch>
              </div>
            </div>
          </template>

          <h2 class="mt-6">
            {{ t('zones.form.connectZone') }}
          </h2>

          <ZoneCreateUniversalInstructions
            v-if="environment === 'universal'"
            :zone-name="name"
            :token="token"
          />

          <ZoneCreateKubernetesInstructions
            v-else
            :zone-name="name"
            :zone-ingress-enabled="zoneIngressEnabled"
            :zone-egress-enabled="zoneEgressEnabled"
            :token="token"
            :base64-encoded-token="base64EncodedToken"
          />

          <EntityScanner
            :loader-function="scanForEnabledZone"
            :has-error="scanError !== null"
            :can-complete="isScanComplete"
            data-testid="zone-connected-scanner"
          >
            <template #loading-title>
              {{ t('zones.form.scan.waitTitle') }}
            </template>

            <template #complete-title>
              {{ t('zones.form.scan.completeTitle') }}
            </template>

            <template #complete-content>
              <p>
                {{ t('zones.form.scan.completeDescription', { name }) }}
              </p>

              <p class="mt-2">
                <KButton
                  appearance="primary"
                  :to="{
                    name: 'zone-cp-detail-view',
                    params: {
                      zone: name
                    },
                  }"
                >
                  {{ t('zones.form.scan.completeButtonLabel', { name }) }}
                </KButton>
              </p>
            </template>

            <template #error-title>
              <h3>{{ t('zones.form.scan.errorTitle') }}</h3>
            </template>

            <template #error-content>
              <p>{{ t('zones.form.scan.errorDescription') }}</p>
            </template>
          </EntityScanner>
        </div>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { type BadgeAppearance, KButton, KInput, KInputSwitch, KLabel, KRadio } from '@kong/kongponents'
import { computed, ref } from 'vue'

import EntityScanner from '../components/EntityScanner.vue'
import ZoneCreateKubernetesInstructions from '../components/ZoneCreateKubernetesInstructions.vue'
import ZoneCreateUniversalInstructions from '../components/ZoneCreateUniversalInstructions.vue'
import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import { ApiError } from '@/services/kuma-api/ApiError'
import { useI18n, useKumaApi } from '@/utilities'
import { getItemStatusFromInsight } from '@/utilities/dataplane'

type ErrorState = {
  error: Error | null
  title: string | null
  description?: string
  icon: string
  badgeAppearance: BadgeAppearance
}

const { t } = useI18n()
const kumaApi = useKumaApi()

const HANDLED_STATUS_CODES = [400, 409, 500]

const zone = ref<{ token: string } | null>(null)
const isChangingZone = ref(false)
const changingError = ref<Error | null>(null)
const errorState = ref<ErrorState>({
  error: null,
  title: null,
  icon: 'warning',
  badgeAppearance: 'warning',
})

const isScanComplete = ref(false)
const scanError = ref<Error | null>(null)

const name = ref('')
const environment = ref<'universal' | 'kubernetes'>('kubernetes')
const zoneIngressEnabled = ref(true)
const zoneEgressEnabled = ref(true)

const token = computed(() => zone.value !== null && zone.value.token ? zone.value.token : '')
const base64EncodedToken = computed(() => token.value !== '' ? window.btoa(token.value) : '')

const isCreateButtonDisabled = computed(() => {
  return name.value === '' ||
    isChangingZone.value ||
    zone.value !== null
})

/**
 * Creates a Zone via request to the appropriate endpoint. Importantly, this returns a Zone object including a base64-encoded token which is needed for enabling the Zone in the subsequent steps of the Zone creation flow.
 */
async function createZone() {
  isChangingZone.value = true
  changingError.value = null

  try {
    zone.value = await kumaApi.createZone({ name: name.value })
  } catch (err) {
    if (err instanceof ApiError && HANDLED_STATUS_CODES.includes(err.status)) {
      errorState.value = {
        error: err,
        title: t(`zones.create.statusError.${err.status}.title`, { zoneName: name.value }),
        description: t(`zones.create.statusError.${err.status}.description`).trim(),
        icon: err.status === 500 ? 'warning' : 'errorFilled',
        badgeAppearance: err.status === 500 ? 'warning' : 'danger',
      }
    } else if (err instanceof Error) {
      errorState.value = {
        error: err,
        title: t('zones.create.generalError.title'),
        icon: 'warning',
        badgeAppearance: 'danger',
      }
    } else {
      console.error(err)
    }
  } finally {
    isChangingZone.value = false
  }
}

/**
 * Polling callback function passed to the EntityScanner component used to determine whether a Zone was connected successfully.
 */
async function scanForEnabledZone() {
  isScanComplete.value = false
  scanError.value = null

  try {
    // The presence of a `ZoneOverview` object’s subscriptions with a connect time and without a disconnect time indicate a Zone to be online.
    const zoneOverview = await kumaApi.getZoneOverview({ name: name.value })
    const status = getItemStatusFromInsight(zoneOverview.zoneInsight)
    isScanComplete.value = status === 'online'
  } catch (err) {
    if (err instanceof Error) {
      scanError.value = err
    } else {
      console.error(err)
    }
  }
}
</script>

<style lang="scss" scoped>
// TODO: Remove these once we have this sort of style covered by our base styles.
ul:not(:first-child),
p:not(:first-child) {
  margin-top: var(--spacing-md);
}

ul {
  padding-left: var(--spacing-lg);
  list-style: disc;
}
</style>
