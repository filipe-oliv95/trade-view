import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import Stack from "@mui/material/Stack";
import MuiCard from "../../shared/MuiCard";

export default function TradesPorEstrategia({ dataset }) {
  const series = [
    {
      data: dataset?.map((item) => item.valor_dia),
      label: "Resultado",
    },
  ];

  const data = dataset?.map((item) => item.data);
  console.log("dataset", dataset)
  return (
    <MuiCard>
      <Stack direction="column" spacing={1} sx={{ minWidth: 600 }}>
        <BarChart
          height={300}
          grid={{ horizontal: true }}
          series={series}
          margin={{
            top: 10,
            bottom: 20,
          }}
          yAxis={[
            {
              colorMap: {
                type: "piecewise",
                thresholds: [0],
                colors: ["red", "green"],
              },
            },
          ]}
          xAxis={[
            {
              scaleType: "band",
              data: data,
              valueFormatter: (date) => {
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const year = String(date.getFullYear()).slice(2);
                return `${day}-${month}-${year}`;
              },
              colorMap: {
                type: "piecewise",
                thresholds: [new Date(2021, 1, 1), new Date(2023, 1, 1)],
                colors: ["blue", "red", "blue"],
              },
            },
          ]}
        />
      </Stack>
    </MuiCard>
  );
}
