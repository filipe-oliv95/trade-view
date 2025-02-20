import * as React from "react";
import Box from "@mui/material/Box";
import PeriodSelect from "../Select";
import { Button } from "@mui/material";
import BasicDatePicker from "../../shared/DatePicker";
import DownloadIcon from "@mui/icons-material/Download";

export default function DashboardFilter({
  showDatePicker,
  setStartDate,
  setEndDate,
  endDate,
  setShowDatePicker,
  exportPDF,
}) {
  return (
    <Box
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: "20px",
        width: "100%",
      }}
    >
      <PeriodSelect
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        endDate={endDate}
        setShowDatePicker={setShowDatePicker}
      />
      {showDatePicker && (
        <>
          <BasicDatePicker
            sx={{ padding: 0 }}
            text="Data Inicial"
            onChange={setStartDate}
            isStart={true}
          />
          <BasicDatePicker
            text="Data Final"
            onChange={setEndDate}
            isStart={false}
          />
        </>
      )}
      <Button
        variant="outlined"
        startIcon={<DownloadIcon />}
        onClick={exportPDF}
        sx={{ height: "56px" }}
      >
        Exportar PDF
      </Button>
    </Box>
  );
}
