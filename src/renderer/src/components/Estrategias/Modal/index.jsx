import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

// type - "add" or "update"
// title - título do modal
// onSubmit - função de adicionar ou atualizar dados de estrategia
// onClose - função de fechar modal
// open - estado aberto ou fechado do modal
// estrategia - dados de estrategia com "sigla", "descricao" e "valor_contrato"
// ativos - dados de ativos para adicionar à estratégia

export default function Modal({
  type,
  onSubmit,
  onClose,
  open,
  estrategia,
  ativos,
}) {
  const [data, setData] = useState({
    nome: "",
    descricao: "",
    gain: "",
    loss: "",
    ativo_id: "",
  });

  useEffect(() => {
    if (estrategia && type === "update") {
      setData({
        nome: estrategia.nome || "",
        descricao: estrategia.descricao || "",
        gain: estrategia.gain || "",
        loss: estrategia.loss || "",
        ativo_id: estrategia.ativo_id || "",
      });
    }
  }, [estrategia, type]);

  const handleChange = (field, value) => {
    setData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleModalClose = () => {
    setData({
      nome: "",
      descricao: "",
      gain: "",
      loss: "",
      ativo_id: "",
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
          {type === "update" ? "Atualização de Estratégia" : "Nova Estratégia"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Nome"
            name="nome"
            value={data?.nome || ""}
            onChange={(e) => handleChange("nome", e.target.value.toUpperCase())}
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
          <Select
            name="ativo_id"
            value={data?.ativo_id || ""}
            onChange={(e) => handleChange("ativo_id", e.target.value)}
            fullWidth
            margin="dense"
            displayEmpty
            renderValue={(selected) => {
              if (!selected) {
                return <span style={{ color: "grey" }}>Ativo</span>;
              }
              return ativos.find((ativo) => ativo.id === selected)?.sigla || "";
            }}
            sx={{ marginTop: "8px", marginBottom: "4px" }}
          >
            <MenuItem value="" disabled>
              Ativo
            </MenuItem>
            {ativos.map((ativo) => (
              <MenuItem key={ativo.id} value={ativo.id}>
                {ativo.sigla} - {ativo.descricao}
              </MenuItem>
            ))}
          </Select>
          <TextField
            label="Gain"
            name="gain"
            value={data?.gain || ""}
            onChange={(e) => handleChange("gain", e.target.value)}
            type="number"
            fullWidth
            margin="dense"
          />
          <TextField
            label="Loss"
            name="loss"
            value={data?.loss || ""}
            onChange={(e) => handleChange("loss", e.target.value)}
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
            onClick={() => handleSubmit(estrategia?.id, data)}
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
