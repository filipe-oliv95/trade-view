import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { Box, Typography } from "@mui/material";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";

export default function PieClickNoSnap({
  data,
  onRowSelect,
  selectedEstrategiaId,
}) {
  const [highlightedItem, setHighLightedItem] = React.useState(null); // retorno: {type: 'pie', seriesId: 'auto-generated-id-0', dataIndex: 1}
  console.log("highlightedItem", highlightedItem);
  if (!data || data.length === 0) {
    return <Typography variant="h6">Nenhum dado disponível</Typography>;
  }

  const handleClick = (event, itemIdentifier, item) => {
    console.log("item", item.id);
    setHighLightedItem((prev) =>
      prev?.dataIndex === itemIdentifier.dataIndex ? null : itemIdentifier
    );
    onRowSelect((prev) => (prev === item.id ? null : item.id));
  };

  React.useEffect(() => {
    if (!selectedEstrategiaId || !data) {
      setHighLightedItem(null);
      return;
    }

    // Encontrar o índice correto dentro dos dados do gráfico
    const selectedIndex = data.findIndex(
      (item) => item.estrategia_id === selectedEstrategiaId
    );

    if (selectedIndex !== -1) {
      setHighLightedItem({
        type: "pie",
        seriesId: "auto-generated-id-0",
        dataIndex: selectedIndex,
      });
    } else {
      setHighLightedItem(null);
    }
  }, [selectedEstrategiaId, data]);

  const PercentageValue = () => {
    if (!highlightedItem) return ""; // Retorna string vazia se não houver item destacado
  
    // Encontrar o item selecionado
    const selectedItem = data.find(
      (item) => item.estrategia_id === selectedEstrategiaId
    );
  
    if (!selectedItem) return ""; // Retorna string vazia se não encontrar o item
  
    const value = selectedItem.total_fin;
  
    // Calcular o valor total
    const totalValue = data.reduce((sum, item) => sum + item.total_fin, 0);
  
    if (totalValue === 0) return ""; // Evita divisão por zero
  
    return `${Math.floor((value / totalValue) * 100)}%`; // Retorna sem casas decimais
  };

  console.log("PercentageValue()", PercentageValue());

  const StyledText = styled("text")(({ theme }) => ({
    fill: theme.palette.text.primary,
    textAnchor: "middle",
    dominantBaseline: "central",
    fontSize: 20,
  }));

  function PieCenterLabel({ children }) {
    const { width, height, left, top } = useDrawingArea();
    return (
      <StyledText x={left + width / 2} y={top + height / 2}>
        {children}
      </StyledText>
    );
  }

  return (
    <Box textAlign="center">
      <PieChart
        series={[
          {
            data: data?.map((d) => ({
              label: d.estrategia,
              id: d.estrategia_id,
              value: d.total_fin,
            })),
            innerRadius: 85, // Camada externa - Estratégias
            outerRadius: 50,
            highlightScope: { faded: "global", highlighted: "item" },
            arcLabel: (params) => (params.label ? `${params.label}` : ""),
          },
        ]}
        highlightedItem={highlightedItem}
        slotProps={{
          legend: { hidden: true },
        }}
        width={200}
        height={200}
        margin={{ right: 0 }}
        onItemClick={handleClick}
      >
        <PieCenterLabel>{PercentageValue()}</PieCenterLabel>
      </PieChart>
    </Box>
  );
}
