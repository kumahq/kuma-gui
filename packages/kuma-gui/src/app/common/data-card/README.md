# DataCard

KCard for specifically showing Key/Value pairs plus a main title

<script lang="ts" setup>
import DataCard from '@/app/common/data-card/DataCard.vue'
</script>

<iframe
  height="800"
  data-why
  title="data-card"
>
  <DataCard
    v-for="item in Array.from({length: 5})"
  >
    <template #title>
      The title
    </template>
    <dl>
      <div>
        <dt>Data 1</dt>
        <dd>1,000</dd>
      </div>
      <div>
        <dt>Data 2</dt>
        <dd>Value</dd>
      </div>
      <div>
        <dt>Data 3</dt>
        <dd>80</dd>
      </div>
      <div>
        <dt>Data 4</dt>
        <dd>-</dd>
      </div>
    </dl>
  </DataCard>
</iframe>
