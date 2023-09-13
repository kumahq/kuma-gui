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
          v-if="token === '' || isZoneConnected"
          appearance="outline"
          data-testid="exit-button"
          :to="{ name: 'zone-cp-list-view' }"
        >
          {{ t('zones.form.exit') }}
        </KButton>

        <KButton
          v-else
          appearance="outline"
          data-testid="exit-button"
          @click="toggleConfirmModal"
        >
          {{ t('zones.form.exit') }}
        </KButton>
      </template>

      <div class="form-wrapper">
        <KCard>
          <template #body>
            <div class="form">
              <div>
                <h1 class="form-title">
                  <span class="text-gradient">{{ t('zones.routes.create.title') }}</span>
                </h1>
              </div>

              <div class="form-section">
                <div class="form-section__header">
                  <h2 class="form-section-title">
                    {{ t('zones.form.section.name.title') }}
                  </h2>
                </div>

                <div class="form-section__content">
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
                      :data-test-error-type="nameError !== null ? 'invalid-dns-name' : undefined"
                      :has-error="nameError !== null"
                      :error-message="nameError ?? undefined"
                      :disabled="zone !== null"
                      @blur="validateName(name)"
                    />
                  </div>

                  <KButton
                    appearance="primary"
                    class="mt-4"
                    :icon="isChangingZone ? 'spinner' : 'plus'"
                    :disabled="isCreateButtonDisabled"
                    data-testid="create-zone-button"
                    @click="createZone"
                  >
                    {{ t('zones.form.createZoneButtonLabel') }}
                  </KButton>

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
                </div>
              </div>

              <template v-if="zone !== null">
                <div
                  class="form-section"
                  data-testid="connect-zone-instructions"
                >
                  <div class="form-section__header">
                    <h2 class="form-section-title">
                      {{ t('zones.form.section.configuration.title') }}
                    </h2>
                  </div>

                  <div class="form-section__content">
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
                      <div class="mt-4">
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

                      <div class="mt-4">
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
                  </div>
                </div>

                <div class="form-section">
                  <div class="form-section__header">
                    <h2 class="form-section-title">
                      {{ t('zones.form.section.connect_zone.title') }}
                    </h2>
                  </div>

                  <div class="form-section__content">
                    <DataSource
                      v-slot="{ data }: ControlPlaneAddressesSource"
                      src="/control-plane/addresses"
                    >
                      <template
                        v-if="(typeof data !== 'undefined')"
                      >
                        <ZoneCreateUniversalInstructions
                          v-if="environment === 'universal'"
                          :zone-name="name"
                          :token="token"
                          :global-kds-address="data.kds"
                        />

                        <ZoneCreateKubernetesInstructions
                          v-else
                          :zone-name="name"
                          :zone-ingress-enabled="zoneIngressEnabled"
                          :zone-egress-enabled="zoneEgressEnabled"
                          :token="token"
                          :base64-encoded-token="base64EncodedToken"
                          :global-kds-address="data.kds"
                        />
                      </template>
                    </DataSource>
                  </div>
                </div>

                <div class="form-section">
                  <div class="form-section__header">
                    <h2 class="form-section-title">
                      {{ t('zones.form.section.scanner.title') }}
                    </h2>
                  </div>

                  <div class="form-section__content">
                    <EntityScanner
                      :loader-function="scanForEnabledZone"
                      :has-error="scanError !== null"
                      :can-complete="isZoneConnected"
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
              </template>
            </div>
          </template>
        </KCard>
      </div>

      <KModal
        :is-visible="isConfirmModalVisible"
        :title="t('zones.form.confirm_modal.title')"
        data-testid="confirm-exit-modal"
        @canceled="toggleConfirmModal"
        @proceed="router.push({ name: 'zone-cp-list-view' })"
      >
        <template #header-content>
          {{ t('zones.form.confirm_modal.title') }}
        </template>

        <template #body-content>
          {{ t('zones.form.confirm_modal.body') }}
        </template>

        <template #action-buttons>
          <KButton
            appearance="primary"
            :to="{ name: 'zone-cp-list-view' }"
            data-testid="confirm-exit-button"
          >
            {{ t('zones.form.confirm_modal.action_button') }}
          </KButton>
        </template>
      </KModal>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { type BadgeAppearance, KButton, KInput, KInputSwitch, KLabel, KModal, KRadio } from '@kong/kongponents'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import EntityScanner from '../components/EntityScanner.vue'
import ZoneCreateKubernetesInstructions from '../components/ZoneCreateKubernetesInstructions.vue'
import ZoneCreateUniversalInstructions from '../components/ZoneCreateUniversalInstructions.vue'
import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import { ControlPlaneAddressesSource } from '@/app/control-planes/sources'
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
const router = useRouter()

/**
 * https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#rfc-1035-label-names
 */
const NAME_REGEX = /^(?![-0-9])[a-z0-9-]{1,63}$/

const zone = ref<{ token: string } | null>(null)
const isChangingZone = ref(false)
const isConfirmModalVisible = ref(false)
const errorState = ref<ErrorState>({
  error: null,
  title: null,
  icon: 'warning',
  badgeAppearance: 'warning',
})
const frontendNameError = ref<string | null>(null)

const isZoneConnected = ref(false)
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

const nameError = computed(() => {
  // Reads client-side error
  if (frontendNameError.value !== null) {
    return frontendNameError.value
  }

  // Reads server-side error
  if (errorState.value.error instanceof ApiError) {
    const nameError = errorState.value.error.invalidParameters.find((param) => param.field === 'name')
    if (nameError !== undefined) {
      return nameError.reason
    }
  }

  return null
})

/**
 * Creates a Zone via request to the appropriate endpoint. Importantly, this returns a Zone object including a base64-encoded token which is needed for enabling the Zone in the subsequent steps of the Zone creation flow.
 */
async function createZone() {
  isChangingZone.value = true
  errorState.value = {
    error: null,
    title: null,
    icon: 'warning',
    badgeAppearance: 'warning',
  }

  try {
    const isValidName = validateName(name.value)
    if (!isValidName) {
      return
    }

    zone.value = await kumaApi.createZone({ name: name.value })
  } catch (err) {
    if (err instanceof ApiError && [409, 500].includes(err.status)) {
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
        title: err instanceof ApiError ? err.title : t('zones.create.generalError.title'),
        description: err instanceof ApiError && err.detail ? err.detail : undefined,
        icon: 'errorFilled',
        badgeAppearance: 'danger',
      }
    } else {
      console.error(err)
    }
  } finally {
    isChangingZone.value = false
  }
}

function validateName(name: string): boolean {
  const isValidName = NAME_REGEX.test(name)

  if (isValidName) {
    frontendNameError.value = null
  } else {
    frontendNameError.value = t('zones.create.invalidNameError')
  }

  return isValidName
}

/**
 * Polling callback function passed to the EntityScanner component used to determine whether a Zone was connected successfully.
 */
async function scanForEnabledZone() {
  isZoneConnected.value = false
  scanError.value = null

  try {
    // The presence of a `ZoneOverview` object’s subscriptions with a connect time and without a disconnect time indicate a Zone to be online.
    const zoneOverview = await kumaApi.getZoneOverview({ name: name.value })
    const status = getItemStatusFromInsight(zoneOverview.zoneInsight)
    isZoneConnected.value = status === 'online'
  } catch (err) {
    if (err instanceof Error) {
      scanError.value = err
    } else {
      console.error(err)
    }
  }
}

function toggleConfirmModal() {
  isConfirmModalVisible.value = !isConfirmModalVisible.value
}
</script>
