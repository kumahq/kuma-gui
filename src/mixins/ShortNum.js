export default {
  created() {
    this.shortNum();
  },
  methods: {
    shortNum(val) {
      if (val !== undefined) {
        val = val.replace(/,/g, "");
      }

      return Math.abs(val) > 999
        ? `${Math.sign(val) * (Math.abs(val) / 1000).toFixed(1)}k`
        : Math.sign(val) * Math.abs(val);
    }
  }
};
