// Mostra o resultado financeiro consolidado para o período.

import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

export default function FinanceResultCard({ dataset }) {

  const theme = useTheme();

  const total =
    dataset.find((item) => item.label === "Total Financeiro")?.value || 0;
  const gain =
    dataset.find((item) => item.label === "Total de Ganhos")?.value || 0;
  const loss =
    dataset.find((item) => item.label === "Total de Perdas")?.value || 0;

  function result(value) {
    return parseFloat(value).toFixed(2);
  }

  return (
    <Card sx={{ minWidth: 275, height: "100%", borderRadius: 3 }}>
      <CardContent sx={{ height: "100%" }}>
        <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 18 }}>
          Resumo Geral de Operações
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
            R$ {result(total)}
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
              <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                total de ganho
              </Typography>
              <Typography
                variant="h5"
                component="div"
                sx={{ fontWeight: "bold", color: theme.palette.success.main }}
              >
                R$ {result(gain)}
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                total de perda
              </Typography>
              <Typography
                variant="h5"
                component="div"
                sx={{ fontWeight: "bold", color: theme.palette.error.main }}
              >
                R$ {result(loss)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
