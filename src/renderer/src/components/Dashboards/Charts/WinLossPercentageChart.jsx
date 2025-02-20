import * as React from "react";
import Box from "@mui/material/Box";
import { PieChart } from "@mui/x-charts/PieChart";
import { useTheme } from "@mui/material/styles";

export default function WinLossPercentageChart({ dataset }) {

  const theme = useTheme();

  const filteredDataset = dataset.filter(
    (item) =>
      item.label === "Porcentagem de Ganhos" ||
      item.label === "Porcentagem de Perdas"
  );

  // Calcula o total de operações
  const totalOperations = dataset.reduce(
    (sum, item) => sum + (item.value || 0),
    0
  );

  const valueFormatter = (item) => `${item.value}%`;

  const customHoverFormatter = (item) =>
    `Tipo: ${item.label}\nValor: ${item.value}%\nTotal de operações: ${totalOperations}`;

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
      <PieChart
        width={150}
        height={150}
        series={[
          {
            data: filteredDataset.map((item) => ({
              label:
                item.label === "Porcentagem de Ganhos"
                  ? ""
                  : item.label === "Porcentagem de Perdas"
                    ? ""
                    : item.label,
              value: item.value,
              color:
                item.label === "Porcentagem de Ganhos"
                  ? theme.palette.success.main // Cor para ganhos
                  : theme.palette.error.main, // Cor para perdas
            })),
            innerRadius: 40,
            arcLabel: (params) => params.label ?? "",
            arcLabelMinAngle: 10,
            valueFormatter,
            hoverFormatter: customHoverFormatter, // Texto personalizado no hover
          },
        ]}
        slotProps={{
          legend: { hidden: true }, // Remove a legenda lateral
        }}
        margin={{ right: 0 }} // Centraliza o gráfico
      />
    </Box>
  );
}
