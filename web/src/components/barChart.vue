<script>
import { Bar } from "vue-chartjs";

export default {
  extends: Bar,
  props: ["sentiment"],
  data: () => ({
    chartData: {
      labels: ["Prashanth", "Gagan", "Mehul", "Pavan"],
      datasets: [
        {
          label: "Sentiment Towards Ashish",
          //   barPercentage: 0.5,
          //   barThickness: 6,
          //   maxBarThickness: 8,
          minBarLength: 2,
          data: [10, 20, 30, -4]
        }
      ]
    },
    options: {
      scales: {
        xAxes: [
          {
            gridLines: {
              offsetGridLines: true
            }
          }
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }
  }),
  mounted() {
    console.log(this.sentiment);
    if (this.sentiment) {
      this.chartData.labels = this.sentiment.labels;
      this.chartData.datasets[0].label = this.sentiment.label;
      this.chartData.datasets[0].data = this.sentiment.data;
    }

    this.renderChart(this.chartData, this.options);
  }
};
</script>

<style></style>
