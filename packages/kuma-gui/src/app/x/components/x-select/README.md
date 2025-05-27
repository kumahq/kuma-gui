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
  <br />
  <XSelect
    :selected="`one`"
    :expanded="true"
    @change="(val) => console.log(val)"
  >
    <template
      v-for="{ value } in [{ value: 'one'}, {value: 'two'}]"
      :key="value"
      #[`${value}-option`]
    >
      <XRadio
        :card="true"
        :value="value"
      >
        <header>{{ value }}</header>
      </XRadio>
    </template>
  </XSelect>
</Story>

