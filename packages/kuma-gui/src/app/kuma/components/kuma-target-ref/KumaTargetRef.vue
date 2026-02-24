<template>
  <XBadge
    appearance="neutral"
  >
    <XLayout
      variant="separated"
    >
      <XDl
        variant="x-stack"
      >
        <div>
          <dt>
            {{ props.targetRef.kind }}
          </dt>
          <dd
            v-if="props.targetRef.name"
          >
            {{ props.targetRef.name }}
          </dd>
        </div>
      </XDl>
      <slot
        name="default"
      />
    </XLayout>
  </XBadge>
</template>
<script lang="ts" setup>
const props = withDefaults(defineProps<{
  targetRef?: {
    kind: string
    labels?: Record<string, string>
    name?: string
    mesh?: string
    namespace?: string
    sectionName?: string
  }
}>(), {
  targetRef: () => ({ kind: 'Mesh' }),
})
</script>
