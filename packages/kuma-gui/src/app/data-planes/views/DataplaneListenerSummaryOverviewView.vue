<template>
  <RouteView
    :params="{
      mesh: '',
      proxy: '',
      connection: '',
    }"
    :name="props.routeName"
    v-slot="{ t, route, uri }"
  >
    <AppView>
      <XLayout variant="y-stack">
        <template
          v-for="listener in [props.dataPlaneOverview.dataplane.networking.listeners.find((item) => item.port === props.data.port)]"
          :key="typeof listener"
        >
          {{ console.log(listener) }}
          <XTable
            v-if="listener"
            variant="kv"
          >
            <tr>
              <th scope="row">
                Type
              </th>
              <td>
                <XBadge>
                  {{ listener.type }}
                </XBadge>
              </td>
            </tr>
            <tr>
              <th scope="row">
                Address
              </th>
              <td>
                <XCopyButton
                  :text="`${listener.address}`"
                />
              </td>
            </tr>
            <tr
              v-if="listener.port"
            >
              <th scope="row">
                Port
              </th>
              <td>
                <XCopyButton
                  :text="`${listener.port}`"
                />
              </td>
            </tr>
          </XTable>
        </template>
      </XLayout>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { DataplaneNetworkingLayout, DataplaneOverview } from '../data'

const props = defineProps<{
  data: DataplaneNetworkingLayout['listeners'][number]
  dataPlaneOverview: DataplaneOverview
  routeName: string
}>()
</script>
