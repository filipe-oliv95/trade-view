// Apresenta o total de dias operados, o melhor e o pior dia, e o número de dias acima e abaixo de uma linha de referência.

import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function OperatingDaysStatsCard({ gain, loss }) {

  function result() {
    const gainInt = parseInt(gain, 10) || 0;
    const lossInt = parseInt(loss, 10) || 0;
    return gainInt - lossInt;
  }

  return (
    <Card sx={{ minWidth: 275, minHeight: 225, borderRadius: 3 }}>
      <CardContent>
        <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 18 }}>
          OUTRA COISA
        </Typography>
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <Typography variant="h3" component="div" sx={{ fontWeight: "bold" }}>
            R$ {result()}
          </Typography>
          <Box style={{marginTop: 10, display:" flex", textAlign: "center", justifyContent: "space-between"}}>
            <Box >
              <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                total de ganho
              </Typography>
              <Typography
                variant="h5"
                component="div"
                sx={{ fontWeight: "bold", color: "green" }}
              >
                R$ {gain}
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                total de perda
              </Typography>
              <Typography
                variant="h5"
                component="div"
                sx={{ fontWeight: "bold", color: "red" }}
              >
                R$ {loss}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
