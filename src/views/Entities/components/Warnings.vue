<template>
  <KCard border-variant="noBorder">
    <template slot="body">
      <ul>
        <li
          v-for="{ kind, payload } in warnings"
          :key="JSON.stringify(payload)"
        >
          <KAlert appearance="warning">
            <template slot="alertMessage">
              <EnvoyIncompatibleWarning
                v-if="kind === 'envoyIncompatible'"
                :payload="payload"
              />
              <span v-else>
                {{ payload }}
              </span>
            </template>
          </KAlert>
        </li>
      </ul>
    </template>
  </KCard>
</template>

<script>
import EnvoyIncompatibleWarning from '@/views/Entities/components/EnvoyIncompatibleWarning'

export default {
  name: 'Warnings',
  components: { EnvoyIncompatibleWarning },
  props: {
    warnings: {
      type: Array,
      required: true,
    },
  },
}
</script>
