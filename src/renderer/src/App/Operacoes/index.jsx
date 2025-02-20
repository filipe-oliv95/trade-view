import React from "react";
import FullFeaturedCrudGrid from "../../components/Operacoes/DataGrid";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import DownloadIcon from "@mui/icons-material/Download";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import MuiCard from "../../components/shared/MuiCard";
import { StyledCsvDownloadButton } from "./styled"

function Operacoes() {

  const [csvExporRows, setCsvExportRows] = React.useState([]);

  return (
    <MuiCard>
      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        {/* <Button
          color="inherit"
          startIcon={<FileUploadIcon fontSize="var(--icon-fontSize-md)" />}
        >
          Importar
        </Button> */}
        <StyledCsvDownloadButton
          data={csvExporRows}
          filename="tradeview"
        >
          <DownloadIcon />
          EXPORTAR COMO EXCEL
        </StyledCsvDownloadButton>
      </Stack>
      <h2>Tabela de Operações</h2>
      <FullFeaturedCrudGrid setCsvExportRows={setCsvExportRows} />
    </MuiCard>
  );
}
export default Operacoes;
