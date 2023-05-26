<template>
  <div>
    <h3>1. {{ i18n.t('zones.form.kubernetes.prerequisites.title') }}</h3>

    <ul>
      <li>
        <b>{{ i18n.t('zones.form.kubernetes.prerequisites.step1Label') }}{{ props.zoneIngressEnabled ? ' ' + i18n.t('zones.form.kubernetes.prerequisites.step1LabelAddendum') : '' }}</b>:
        {{ i18n.t('zones.form.kubernetes.prerequisites.step1Description', { productName: env('KUMA_PRODUCT_NAME') }) }}
      </li>

      <li>
        <b>{{ i18n.t('zones.form.kubernetes.prerequisites.step2Label') }}</b>:
        {{ i18n.t('zones.form.kubernetes.prerequisites.step2Description') }}
      </li>

      <li>
        <a href="https://helm.sh/docs/intro/install/">{{ i18n.t('zones.form.kubernetes.prerequisites.step3LinkTitle') }}</a> {{ i18n.t('zones.form.kubernetes.prerequisites.step3Tail') }}
      </li>
    </ul>

    <h3>2. {{ i18n.t('zones.form.kubernetes.helm.title') }}</h3>

    <p>On your local machine, create a namespace in your Kubernetes cluster and pull down the kong Helm repo.</p>

    <ol>
      <li>
        {{ i18n.t('zones.form.kubernetes.helm.step1Description') }}

        <CodeBlock
          id="zone-kubernetes-create-namespace"
          class="mt-4"
          :code="i18n.t('zones.form.kubernetes.helm.step1Command')"
          language="bash"
        />
      </li>

      <li>
        {{ i18n.t('zones.form.kubernetes.helm.step2Description') }}

        <CodeBlock
          id="zone-kubernetes-add-charts-repo"
          class="mt-4"
          :code="i18n.t('zones.form.kubernetes.helm.step2Command')"
          language="bash"
        />
      </li>

      <li>
        {{ i18n.t('zones.form.kubernetes.helm.step3Description') }}

        <CodeBlock
          id="zone-kubernetes-repo-update"
          class="mt-4"
          :code="i18n.t('zones.form.kubernetes.helm.step3Command')"
          language="bash"
        />
      </li>
    </ol>

    <h3>3. {{ i18n.t('zones.form.kubernetes.secret.title') }}</h3>

    <p>{{ i18n.t('zones.form.kubernetes.secret.description1') }}</p>

    <CodeBlock
      id="zone-kubernetes-token"
      class="mt-4"
      :code="props.token"
      language="bash"
    />

    <p>{{ i18n.t('zones.form.kubernetes.secret.description2') }}</p>

    <CodeBlock
      id="zone-kubernetes-create-secret"
      class="mt-4"
      :code="kubernetesCreateSecretCommand"
      language="bash"
    />

    <h3>4. {{ i18n.t('zones.form.kubernetes.connectZone.title') }}</h3>

    <p>{{ i18n.t('zones.form.kubernetes.connectZone.description1') }}</p>

    <span class="k-input-label mt-4">
      {{ i18n.t('zones.form.kubernetes.connectZone.fileName') }}
    </span>

    <CodeBlock
      id="zone-kubernetes-config-code-block"
      :code="kubernetesConfig"
      language="yaml"
    />

    <p class="mt-4">
      {{ i18n.t('zones.form.kubernetes.connectZone.description2') }}
    </p>

    <CodeBlock
      id="zone-kubernetes-command-code-block"
      class="mt-4"
      :code="i18n.t('zones.form.kubernetes.connectZone.command')"
      language="bash"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import CodeBlock from '@/app/common/CodeBlock.vue'
import {
  useEnv,
  useI18n,
  useGetGlobalKdsAddress,
} from '@/utilities'

const env = useEnv()
const getGlobalKdsAddress = useGetGlobalKdsAddress()
const i18n = useI18n()
const route = useRoute()

const props = defineProps({
  zoneName: {
    type: String,
    required: true,
  },

  zoneIngressEnabled: {
    type: Boolean,
    required: true,
  },

  zoneEgressEnabled: {
    type: Boolean,
    required: true,
  },

  token: {
    type: String,
    required: true,
  },

  base64EncodedToken: {
    type: String,
    required: true,
  },
})

const kubernetesCreateSecretCommand = computed(() => i18n.t('zones.form.kubernetes.secret.command', {
  token: props.base64EncodedToken,
}).trim())
const kubernetesConfig = computed(() => {
  const placeholders: Record<string, string> = {
    zoneName: props.zoneName,
    globalKdsAddress: getGlobalKdsAddress(),
    zoneIngressEnabled: String(props.zoneIngressEnabled),
    zoneEgressEnabled: String(props.zoneEgressEnabled),
  }

  if (typeof route.params.virtualControlPlaneId === 'string') {
    placeholders.controlPlaneId = route.params.virtualControlPlaneId
  }

  return i18n.t('zones.form.kubernetes.connectZone.config', placeholders).trim()
})

</script>

<style lang="scss" scoped>
// TODO: Remove these once we have this sort of style covered by our base styles.
h3:not(:first-child),
ul:not(:first-child),
p:not(:first-child) {
  margin-top: var(--spacing-md);
}

ul {
  padding-left: var(--spacing-lg);
  list-style: disc;
}
</style>
