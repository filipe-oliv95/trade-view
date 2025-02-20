import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/system";

export default function StrategyTable({ strategiesData, onRowSelect }) {
  const theme = useTheme();

  const [selectedRow, setSelectedRow] = React.useState(null);
  const [selectedEstrategia, setSelectedEstrategia] = React.useState(null);

  const handleRowClick = (index, row) => {
    setSelectedEstrategia(row.estrategia);
    onRowSelect((prev) =>
      prev === row.estrategia_id ? null : row.estrategia_id
    );
    setSelectedRow((prev) => (prev === index ? null : index));
  };

  const processRows = (rows) => {
    if (!rows || rows.length === 0) return [];

    // Ordenar por ativo (ascendente) e depois por total_fin (ascendente)
    const sortedRows = [...rows].sort((a, b) => {
      if (a.ativo < b.ativo) return -1;
      if (a.ativo > b.ativo) return 1;
      return a.total_fin - b.total_fin;
    });

    let lastAtivo = null;

    // Processar as linhas para deixar o ativo vazio nas repetições e arredondar valores
    return sortedRows.map((row) => {
      const roundedRow = {
        ...row,
        gain_fin: row.gain_fin ? row.gain_fin.toFixed(2) : "0.00",
        loss_fin: row.loss_fin ? row.loss_fin.toFixed(2) : "0.00",
        total_fin: row.total_fin ? row.total_fin.toFixed(2) : "0.00",
      };
      if (row.ativo === lastAtivo) {
        return { ...roundedRow, ativo: "" }; // Deixa o ativo vazio se for o mesmo do anterior
      }
      lastAtivo = row.ativo;
      return roundedRow;
    });
  };

  const rows = processRows(strategiesData);

  return (
    <Card sx={{ minWidth: 600, borderRadius: 3, height: "100%" }}>
      <CardContent>
        {selectedRow !== null ? (
          <Typography
            gutterBottom
            sx={{ color: "text.secondary", fontSize: 18 }}
          >
            Estratégia: {selectedEstrategia}
          </Typography>
        ) : (
          <Typography
            gutterBottom
            sx={{ color: "text.secondary", fontSize: 18 }}
          >
            Desempenho por Estratégia
          </Typography>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
            <Table
              sx={{ minWidth: 650, tableLayout: "auto" }}
              size="small"
              aria-label="a dense table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Ativo</TableCell>
                  <TableCell>Estratégia</TableCell>
                  <TableCell align="right">Gain</TableCell>
                  <TableCell align="right">Loss</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows?.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      backgroundColor:
                        selectedRow !== null && selectedRow === index
                          ? theme.palette.primary.main
                          : "",
                      cursor: "pointer",
                      color:
                        selectedRow == null
                          ? ""
                          : selectedRow === index
                            ? ""
                            : theme.palette.text.terciary,
                    }}
                    hover={false}
                    selected={false}
                    onClick={() => handleRowClick(index, row)}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ width: 50, color: "inherit" }}
                    >
                      {row.ativo}
                    </TableCell>
                    <TableCell sx={{ width: 50, color: "inherit" }}>
                      {row.estrategia}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ width: 50, color: "inherit" }}
                    >
                      R$ {row.gain_fin}
                      <Typography
                        style={{
                          color:
                            selectedRow == null
                              ? theme.palette.text.secondary
                              : selectedRow === index
                                ? ""
                                : theme.palette.text.terciary,
                          fontSize: "14px",
                        }}
                      >
                        ({row.gain_qnt}{" "}
                        {row.gain_qnt === 1 ? "operação" : "operações"})
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ width: 50, color: "inherit" }}
                    >
                      R$ {row.loss_fin}
                      <Typography
                        style={{
                          color:
                            selectedRow == null
                              ? theme.palette.text.secondary
                              : selectedRow === index
                                ? ""
                                : theme.palette.text.terciary,
                          fontSize: "14px",
                        }}
                      >
                        ({row.loss_qnt}{" "}
                        {row.loss_qnt === 1 ? "operação" : "operações"})
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                       
                        width: 50, color:
                          selectedRow === null && row.total_fin >= 0
                            ? theme.palette.success.main
                            : selectedRow === null && row.total_fin < 0
                              ? theme.palette.error.main
                              : selectedRow !== null && selectedRow === index
                                ? theme.palette.text.primary
                                : theme.palette.text.terciary,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>

                      <Box>

                      <Typography>R$ {row.total_fin}</Typography>
                      <Typography
                        style={{
                          color:
                          selectedRow == null
                          ? theme.palette.text.secondary
                          : selectedRow === index
                          ? ""
                          : theme.palette.text.terciary,
                          fontSize: "14px",
                        }}
                        >
                        ({row.total_qnt}{" "}
                        {row.total_qnt === 1 ? "operação" : "operações"})
                      </Typography>
                        </Box>
                        </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </CardContent>
    </Card>
  );
}
