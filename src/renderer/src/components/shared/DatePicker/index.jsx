import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

export default function BasicDatePicker({ text, onChange, isStart }) {

  const handleDateChange = (newDate) => {
    // Verifica se a data não é nula ou indefinida
    if (newDate) {
      let formattedDate;

      if (isStart) {
        // Formata a data para o formato 'YYYY-MM-DD'
        formattedDate = dayjs(newDate).format("YYYY-MM-DD 00:00:00");
      } else {
        // Formata a data para o formato 'YYYY-MM-DD 00:00:00'
        formattedDate = dayjs(newDate).format("YYYY-MM-DD");
      }

      // Chama a função onChange passando a data formatada
      if (onChange) {
        onChange(formattedDate);
      }
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DatePicker"]}>
        <DatePicker
          label={text}
          onChange={handleDateChange}
          format="DD/MM/YYYY"
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
