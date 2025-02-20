import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import WinLossPercentageChart from "../Charts/WinLossPercentageChart";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";

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
        sx={{ color: "text.secondary" }}
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

function InfoDisplay({ title, description, value, percent }) {
  return (
    <Box display="flex" alignItems="center" gap="10px">
      <MouseHoverPopover title={title} description={description} />
      <Typography variant="h5" component="div" sx={{ fontWeight: "bold" }}>
        {value}
        {percent && (
          <Box
            component="span"
            variant="h5"
            sx={{
              fontWeight: "regular",
              fontSize: 18,
              color: "text.secondary",
              marginLeft: 1,
            }}
          >
            ({percent} %)
          </Box>
        )}
      </Typography>
    </Box>
  );
}

export default function OperationsSummaryCard({ dataset }) {
  // Calculando o total de operações de gain, loss e a média
  const totalOperations =
    dataset.find((item) => item.label === "Total de Operações")?.value || 0;
  const gainOperations =
    dataset.find((item) => item.label === "Quantidade de Ganhos")?.value || 0;
  const lossOperations =
    dataset.find((item) => item.label === "Quantidade de Perdas")?.value || 0;

  const percentGain =
    dataset.find((item) => item.label === "Porcentagem de Ganhos")?.value || 0;
  const percentLoss =
    dataset.find((item) => item.label === "Porcentagem de Perdas")?.value || 0;

  return (
    <Card
      sx={{ minWidth: 380, minHeight: 225, height: "100%", borderRadius: 3 }}
    >
      <CardContent sx={{ height: "100%" }}>
        <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 18 }}>
          Distribuição de Operações (Ganho x Perda)
        </Typography>
        <Box
          display="flex"
          justifyContent="space-evenly"
          alignItems="space-evenly"
          height="100%"
        >
          <WinLossPercentageChart dataset={dataset} />
          <Box
            sx={{
              marginLeft: "15px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
            }}
          >
            <InfoDisplay
              title="positivas: "
              description="Número de operações com resultado financeiro positivo."
              value={gainOperations}
              percent={percentGain}
            />
            <InfoDisplay
              title="negativas: "
              description="Número de operações com resultado financeiro negativo."
              value={lossOperations}
              percent={percentLoss}
            />
            <InfoDisplay
              title="total: "
              description="Número total de operações."
              value={totalOperations}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
