import React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

const EquityGrowthChart = ({ dataset }) => {

  const theme = useTheme();

  return (
    <Card sx={{ minWidth: 275, height: "100%", borderRadius: 3, padding: 3 }}>
      <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 18 }}>
        Evolução do Patrimônio
      </Typography>
      <LineChart
        dataset={dataset}
        xAxis={[
          {
            id: "Dias",
            dataKey: "data",
            scaleType: "time",
            valueFormatter: (date) => {
              const parsedDate = new Date(date);  // Garante que seja um objeto Date
              const day = String(parsedDate.getDate()).padStart(2, "0");
              const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
              const year = String(parsedDate.getFullYear()).slice(2);
              return `${day}-${month}-${year}`;
            }
          },
        ]}
        yAxis={[
          {
            colorMap: {
              type: "piecewise",
              thresholds: [0],
              colors: [theme.palette.error.main, theme.palette.success.main],
            },
          },
        ]}
        grid={{ vertical: false, horizontal: true }}
        series={[
          {
            id: "ValorAcumulado",
            dataKey: "valor_acumulado",
            area: true,
            showMark: true,
          },
        ]}
        height={400}
        margin={{ left: 70 }}
        slotProps={{
          legend: { hidden: true },
        }}
      />
    </Card>
  );
};

export default EquityGrowthChart;
