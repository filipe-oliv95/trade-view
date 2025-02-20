import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function PeriodSelect({
  setStartDate,
  setEndDate,
  endDate,
  setShowDatePicker,
}) {

  const [period, setPeriod] = React.useState("1");
  // Função para formatar a data no formato YYYY-MM-DD
  const formatDate = (date) => {
    if (date instanceof Date) {
      // Verifica se é um objeto Date
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    console.error("Invalid date object passed to formatDate:", date);
    return null; // Retorna nulo se não for um Date válido
  };

  const handleChange = (event) => {
    const selectedPeriod = event.target.value;
    setPeriod(selectedPeriod);

    const currentDate = new Date();

    if (selectedPeriod === 1) {
      // Período Total
      setStartDate("1950-01-01 00:00:00");
      setEndDate("9999-11-31");
      setShowDatePicker(false);
    } else if (selectedPeriod === 2) {
      // Mês atual
      const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const endOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );
      setStartDate(`${formatDate(startOfMonth)} 00:00:00`);
      setEndDate(formatDate(endOfMonth));
      setShowDatePicker(false);
    } else if (selectedPeriod === 3) {
      // Ano atual
      const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
      const endOfYear = new Date(currentDate.getFullYear(), 11, 31);
      setStartDate(`${formatDate(startOfYear)} 00:00:00`);
      setEndDate(formatDate(endOfYear));
      setShowDatePicker(false);
    } else if (selectedPeriod === 4) {
      // Personalizado
      setShowDatePicker(true);
    }
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Período</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={period}
          label="Período"
          onChange={handleChange}
          defaultValue={period}
        >
          <MenuItem value={1}>Completo</MenuItem>
          <MenuItem value={2}>Mês atual</MenuItem>
          <MenuItem value={3}>Ano atual</MenuItem>
          <MenuItem value={4}>Personalizado</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
