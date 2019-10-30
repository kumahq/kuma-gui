<template>
  <div class="overview">
    <page-header>
      <div>
        <h2 class="title-3x">
          Global Overview
        </h2>
      </div>
      <div class="dashboard-control d-flex flex-wrap">
        <TimeFramePicker
          :update-controls="updateControls"
          :options="timeFrameOptions"
        />
      </div>
    </page-header>
    <page-content/>
  </div>
</template>

<script>
import PageHeader from '@/components/Utils/PageHeader.vue'
import PageContent from '@/components/Utils/PageContent.vue'
import { options as timeFrameOptions } from '@/schemas/TimeFrames'
import TimeFramePicker from '@/pdk/components/TimeFramePicker'

export default {
  name: 'Overview',
  components: {
    PageHeader,
    PageContent,
    TimeFramePicker
  },
  data () {
    return {
      timeFrameOptions
    }
  }
}
</script>
