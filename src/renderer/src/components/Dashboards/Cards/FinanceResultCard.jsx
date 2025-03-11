// Mostra o resultado financeiro consolidado para o período.

import * as React from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { BarChart } from "@mui/x-charts/BarChart";
import { useTheme } from "@mui/material/styles";

import { barChartValueFormatter, valueFormatter } from "../../../utils/valueFormatter";

export default function FinanceResultCard({ dataset }) {
  const theme = useTheme();

  const total =
    dataset.find((item) => item.label === "Total Financeiro")?.value || 0;
  const gain =
    dataset.find((item) => item.label === "Total de Ganhos")?.value || 0;
  const loss =
    dataset.find((item) => item.label === "Total de Perdas")?.value || 0;

  const chartSetting = {
    xAxis: [
      {
        hideTooltip: true,
      },
    ],
    width: 300,
    height: 50,
  };

  return (
    <Card sx={{ minWidth: 275, height: "100%", borderRadius: 3 }}>
      <CardContent sx={{ height: "100%" }}>
        <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 18 }}>
          Saldo
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Typography variant="h3" component="div" sx={{ fontWeight: "bold" }}>
            {/* R$ {valueFormatter(total)} */}
            R$ {valueFormatter("1266686.6")}
          </Typography>
          <Box
            style={{
              marginTop: 10,
              display: " flex",
              textAlign: "center",
              justifyContent: "space-evenly",
            }}
          >
            <Box>
              <BarChart
                dataset={[
                  {
                    gain: gain,
                    loss: loss,
                  },
                ]}
                yAxis={[{ scaleType: "band", dataKey: "id" }]}
                series={[
                  {
                    dataKey: "gain",
                    label: "Ganhos",
                    barChartValueFormatter,
                    stack: "total",
                    color: theme.palette.success.main,
                  },
                  {
                    dataKey: "loss",
                    label: "Perdas",
                    barChartValueFormatter,
                    stack: "total",
                    color: theme.palette.error.main,
                  },
                ]}
                layout="horizontal"
                slots={{
                  axisLine: () => null, // Remove a linha do eixo
                  axisTick: () => null, // Remove os ticks
                  axisTickLabel: () => null, // Remove os rótulos dos ticks
                  legend: () => null, // Remove a legenda
                }}
                // barLabel='value'
                barLabel={({ value }) => barChartValueFormatter(value)}
                margin={{ top: 0, bottom: 0, right: 0 }}
                {...chartSetting}
              />
            <Typography sx ={{ color: "grey"}}>ganhos vs perdas</Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
