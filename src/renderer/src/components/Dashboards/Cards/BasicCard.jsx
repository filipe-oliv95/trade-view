// Mostra o resultado financeiro consolidado para o período.

import * as React from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { valueFormatter } from "../../../utils/valueFormatter";

export default function BasicCard({ value, title }) {

  return (
    <Card sx={{ borderRadius: 3, width: "300px", height: '130px' }}>
      <CardContent >
        <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 18 }}>
          {title}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            textAlign: "start",
            justifyContent: "start",
          }}
        >
          <Typography variant="h3" component="div" sx={{ fontWeight: "bold" }}>
            R$ {valueFormatter(value)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
