# x-select

<Story>
  <XSelect
    :selected="`one`"
  >
    <template
      v-for="{ value } in [{ value: 'one'}, {value: 'two'}]"
      :key="value"
      #[`${value}-option`]
    >
      {{ value }}
    </template>
  </XSelect>
</Story>

