import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";

function MouseHoverPopover({ title, description }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <Typography
        aria-owns={open ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        sx={{ color: "text.secondary", mb: 1.5, width: 120 }}
      >
        {title}
      </Typography>
      <Popover
        id="mouse-over-popover"
        sx={{ pointerEvents: "none" }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }}>{description}</Typography>
      </Popover>
    </div>
  );
}

function PerformanceIndicator({ title, description, value }) {
  return (
    <Box textAlign="center" sx={{minWidth: 125}}>
      <MouseHoverPopover title={title} description={description} />
      <Typography variant="h5" component="div" sx={{ fontWeight: "bold" }}>
        {value}
      </Typography>
    </Box>
  );
}

export default function PerformanceOverviewCard({ dataset }) {
  const accuracyRate =
    dataset.find((item) => item.label === "Taxa de Acerto")?.value || 0;
  const breakeven =
    dataset.find((item) => item.label === "Breakeven")?.value || 0;
  const riskFactor =
    dataset.find((item) => item.label === "Fator de Risco")?.value || 0;
  const profitFactor =
    dataset.find((item) => item.label === "Fator de Lucro")?.value || 0;
  const avgGain =
    dataset.find((item) => item.label === "Média de Gain")?.value || 0;
  const avgLoss =
    dataset.find((item) => item.label === "Média de Loss")?.value || 0;

  function formatToFixedDecimal(value) {
    return parseFloat(value).toFixed(2);
  }

  function formatToFixedDecimalMoney(value) {
    return `R$ ${parseFloat(value).toFixed(2)}`;
  }

  function formatToPercentage(decimal) {
    return `${(decimal * 100).toFixed(0)}%`;
  }

  return (
    <Card sx={{ minWidth: 395, maxHeight: 200, height: '100%', borderRadius: 3 }}>
      <CardContent>
        <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 18 }}>
          Indicadores de Performance
        </Typography>
        <Box display="flex" justifyContent="space-between" flexWrap='wrap' alignItems='center'>
          <PerformanceIndicator
            title="Taxa de Acerto"
            description="Percentual de operações lucrativas em relação ao total."
            value={formatToPercentage(accuracyRate)}
          />
          <PerformanceIndicator
            title="Fator de Risco"
            description="Relação entre risco assumido e potencial de ganho."
            value={formatToFixedDecimal(riskFactor)}
          />
          <PerformanceIndicator
            title="Fator de Lucro"
            description="Proporção entre lucro total e prejuízo total."
            value={formatToFixedDecimal(profitFactor)}
          />
          <PerformanceIndicator
            title="Breakeven"
            description="Ponto em que os lucros cobrem custos e perdas."
            value={formatToPercentage(breakeven)}
          />
          <PerformanceIndicator
            title="Média de Gain"
            description="Valor financeiro médio obtido em operações vencedoras."
            value={formatToFixedDecimalMoney(avgGain)}
          />

          <PerformanceIndicator
            title="Média de Loss"
            description="Valor financeiro médio perdido em operações não lucrativas."
            value={formatToFixedDecimalMoney(avgLoss)}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
