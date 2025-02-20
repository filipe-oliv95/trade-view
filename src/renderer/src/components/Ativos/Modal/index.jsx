import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

// type - "add" or "update"
// title - título do modal
// onSubmit - função de adicionar ou atualizar dados de ativo
// onClose - função de fechar modal
// open - estado aberto ou fechado do modal
// ativo - dados de ativo com "sigla", "descricao" e "valor_contrato"

export default function Modal({ type, onSubmit, onClose, open, ativo }) {
  const [data, setData] = useState({
    sigla: "",
    descricao: "",
    valor_contrato: "",
  });

  useEffect(() => {
    if (ativo && type === "update") {
      setData({
        sigla: ativo.sigla || "",
        descricao: ativo.descricao || "",
        valor_contrato: ativo.valor_contrato || "",
      });
    }
  }, [ativo, type]);

  const handleChange = (field, value) => {
    setData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleModalClose = () => {
    setData({
      sigla: "",
      descricao: "",
      valor_contrato: "",
    });
    onClose();
  };

  const handleSubmit = (id, data) => {
    if (type === "update") {
      onSubmit(id, data);
    } else {
      onSubmit(data);
    }
    handleModalClose();
  };

  return (
    <>
      <Dialog
        fullWidth
        open={open}
        onClose={handleModalClose}
        disableEscapeKeyDown
      >
        <DialogTitle>
          {type === "update" ? "Atualização de Ativo" : "Novo ativo"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Sigla"
            name="sigla"
            value={data?.sigla || ""}
            onChange={(e) => handleChange("sigla", e.target.value.toUpperCase())}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Descrição"
            name="descricao"
            value={data?.descricao || ""}
            onChange={(e) => handleChange("descricao", e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Valor por Ponto"
            name="valor_contrato"
            value={data?.valor_contrato || ""}
            onChange={(e) => handleChange("valor_contrato", e.target.value)}
            type="number"
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={() => handleSubmit(ativo?.id, data)}
            color="primary"
            variant="contained"
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
