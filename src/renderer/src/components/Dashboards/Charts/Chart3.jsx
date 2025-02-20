import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { dataset } from "./GDPperCapita";

export default function StackedAreas() {
  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  return (
    <LineChart
      dataset={dataset}
      xAxis={[
        {
          id: "Months",
          dataKey: "date",
          scaleType: "time",
          valueFormatter: (date) => months[date.getMonth()],
        },
      ]}
      series={[
        {
          id: "France",
          label: "French GDP per capita",
          dataKey: "valor_dia",
          stack: "total",
          area: true,
          showMark: false,
        },
      ]}
      width={600}
      height={400}
      margin={{ left: 70 }}
    />
  );
}
