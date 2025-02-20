import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";

export default function DailyFinancialBarChart({ dataset }) {
  const [diasPositivos, setDiasPositivos] = React.useState(0);
  const [diasNegativos, setDiasNegativos] = React.useState(0);

  const theme = useTheme();

  const series = [
    {
      data: dataset?.map((item) => item.valor_dia),
      label: "Resultado",
    },
  ];

  const data = dataset?.map((item) => item.data);

  function contarDiasPositivosENegativos(dataset) {
    let diasPositivos = 0;
    let diasNegativos = 0;

    dataset.forEach((item) => {
      if (item.valor_dia > 0) {
        diasPositivos++;
      } else if (item.valor_dia < 0) {
        diasNegativos++;
      }
    });

    return { diasPositivos, diasNegativos };
  }

  React.useEffect(() => {
    setDiasPositivos(contarDiasPositivosENegativos(dataset).diasPositivos);
    setDiasNegativos(contarDiasPositivosENegativos(dataset).diasNegativos);
  }, [dataset]);

  return (
    <Card sx={{ minWidth: 275, height: "100%", borderRadius: 3, padding: 3 }}>
      <Typography
        gutterBottom
        sx={{ color: "text.secondary", fontSize: 18, marginBottom: 1 }}
      >
        Lucros e Prejuízos por Dia
      </Typography>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Typography
          gutterBottom
          sx={{ color: theme.palette.success.main, fontSize: 15 }}
        >
          {diasPositivos} {diasPositivos > 1 || diasPositivos == 0 ? "dias positivos" : "dia positivo"}
        </Typography>
        <Typography gutterBottom sx={{ fontSize: 15 }}>
          x
        </Typography>
        <Typography
          gutterBottom
          sx={{ color: theme.palette.error.main, fontSize: 15 }}
        >
          {diasNegativos} {diasNegativos > 1 || diasNegativos == 0 ? "dias negativos" : "dia negativo"}
        </Typography>
      </Box>
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
                colors: [theme.palette.error.main, theme.palette.success.main],
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
          slotProps={{
            legend: { hidden: true },
          }}
        />
      </Stack>
    </Card>
  );
}
