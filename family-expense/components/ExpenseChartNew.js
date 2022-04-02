import { Card } from "antd";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { interpolateCool } from "d3-scale-chromatic";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import interpolateColors from "../utils/color-generator";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export default function ExpenseChartNew({ selectedMonth }) {
  const [chartData, setChartData] = useState([]);
  const [chartLabels, setChartLabels] = useState([]);
  const [chartColors, setChartColors] = useState([]);

  useEffect(() => {
    getExpenses();
  }, [selectedMonth]);

  const getExpenses = async () => {
    const response = await fetch(`/api/analysis/?month=${selectedMonth}`);
    const result = await response.json();
    console.log(result);
    if (result.error) {
      alert(result.error);
      return;
    }

    let labels = [],
      data = [];
    result.forEach((element) => {
      labels.push(element.type);
      data.push(element.value);
    });

    const colorRangeInfo = {
      colorStart: 0,
      colorEnd: 1,
      useEndAsStart: false,
    };
    const colors = interpolateColors(6, interpolateCool, colorRangeInfo);

    setChartData(data);
    setChartLabels(labels);
    setChartColors(colors);
  };

  const DoughnutChart = () => {
    const config = {
      labels: chartLabels,
      datasets: [
        {
          label: "# of Votes",
          data: chartData,
          backgroundColor: chartColors,
          borderColor: chartColors,
          borderWidth: 1,
        },
      ]
    };
    const options = {
      responsive: true,
      plugins: {
        datalabels: {
          formatter: (value, ctx) => {
            let sum = 0;
            let dataArr = ctx.chart.data.datasets[0].data;
            dataArr.map((data) => {
              sum += data;
            });
            let percentage = ((value * 100) / sum).toFixed(0) + "%";
            return percentage;
          },
          color: "#fff",
        },
      },
    };

    return <Doughnut data={config} options={options} />;
  };

  return (
    <Card size="small" style={{ textAlign: "center", padding: 0 }}>
      <DoughnutChart />
    </Card>
  );
}