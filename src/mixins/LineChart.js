import { Line, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ["options"],
  mounted() {
    this.renderChart(this.chardata, this.options);
  }
};
