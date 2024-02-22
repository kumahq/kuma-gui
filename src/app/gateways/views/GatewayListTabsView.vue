<template>
  <DataSource
    v-slot="{ data: me }: MeSource"
    src="/me"
  >
    <RouteView
      v-if="me"
      v-slot="{ route, t }"
      name="gateway-list-tabs-view"
      :params="{
        mesh: '',
      }"
    >
      <RouterView
        v-slot="{ Component, route: active }"
      >
        <AppView>
          <template #title>
            <h2>
              <RouteTitle
                :title="t(`${active.name === 'builtin-gateway-list-view' ? 'builtin' : 'delegated'}-gateways.routes.items.title`)"
              />
            </h2>
          </template>
          <template #actions>
            <DataCollection
              v-slot="{ items }"
              :items="route.children"
              :empty="false"
            >
              <LinkBox>
                <template
                  v-for="item in items"
                  :key="`${item.name}`"
                >
                  <RouterLink
                    :class="{
                      'active': route.active?.name === item.name,
                    }"
                    :to="{
                      name: item.name,
                      params: {
                        mesh: route.params.mesh,
                      },
                    }"
                  >
                    {{ t(`gateways.routes.items.navigation.${item.name}`) }}
                  </RouterLink>
                </template>
              </LinkBox>
            </DataCollection>
          </template>
          <component
            :is="Component"
          />
        </AppView>
      </RouterView>
    </RouteView>
  </DataSource>
</template>

<script lang="ts" setup>
import LinkBox from '@/app/common/LinkBox.vue'
import type { MeSource } from '@/app/me/sources'

</script>
