import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { Box, Typography } from "@mui/material";

export default function PieClickNoSnap({data}) {

  const [highlightedItem, setHighLightedItem] = React.useState(null);
  
  console.log("highlightedItem", highlightedItem) // {seriesId: 'auto-generated-id-1', dataIndex: 1}

  console.log("data", data)
  if (!data || !data.ativosData || !data.estrategiasData) {
    return <Typography variant="h6">Nenhum dado disponível</Typography>;
  }

  const formatArcLabel = (params) => {
    if (!params.label) return "";
    return (
      params.label
    );
  };

  return (
    <Box textAlign="center">
      <Typography variant="h6" gutterBottom>
        Distribuição de Ativos e Estratégias
      </Typography>
      <PieChart
        series={[
          {
            data: data?.ativosData,
            innerRadius: 30, // Camada interna - Ativos
            outerRadius: 80,
            highlightScope: { faded: "global", highlighted: "item" },
            arcLabel: formatArcLabel,
          },
          {
            data: data?.estrategiasData,
            innerRadius: 85, // Camada externa - Estratégias
            outerRadius: 120,
            highlightScope: { faded: "global", highlighted: "item" },
            arcLabel: (params) => (params.label ? `${params.label}` : ""),
          },
        ]}
        highlightedItem={highlightedItem}
        onHighlightChange={setHighLightedItem}
        slotProps={{
          legend: { hidden: true },
        }}
        width={400}
        height={400}
      />
    </Box>
  );
};