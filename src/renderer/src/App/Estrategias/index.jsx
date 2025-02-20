import React, { useState, useContext } from "react";
import BoxDefault from "../../components/shared/BoxDefault";
import Modal from "../../components/Estrategias/Modal";
import { Button } from "@mui/material";
import { List, ListItem } from "./styled";
import CardEstrategia from "../../components/Estrategias/Card";
import { DataContext } from "../../context/DataContext";
import { useSnackbar } from "notistack";
import useConfirmDialog from "../../hooks/useConfirmDialog";

function Estrategias() {
  const { estrategias, ativos, loading, error, refreshData } = useContext(DataContext);
  const { enqueueSnackbar } = useSnackbar();
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const [selectedEstrategiaId, setSelectedEstrategiaId] = useState(0);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  
  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error.message}</p>;

  const handleDelete = async (id) => {
    await deleteEstrategia(id, refreshData, showConfirmDialog);
  };

  const handleOpenUpdateModal = (id) => {
    setSelectedEstrategiaId(id);
    setOpenUpdateModal(true);
  };
  const handleCloseUpdateModal = () => {
    setSelectedEstrategiaId(null);
    setOpenUpdateModal(false);
  };

  const handleOpenAddModal = (id) => {
    setSelectedEstrategiaId(id);
    setOpenAddModal(true);
  };
  const handleCloseAddModal = () => {
    setSelectedEstrategiaId(null);
    setOpenAddModal(false);
  };

  // Adicionar um estratégia
  const addEstrategia = async (data) => {
    try {
      const response =
        await window.api?.sqlite?.estrategiaDB?.addEstrategia(data);

      if (response.status === 201) {
        enqueueSnackbar("Estratégia adicionada com sucesso!", {
          variant: "success",
        });
        refreshData();
      } else {
        enqueueSnackbar(response.message || "Erro ao adicionar estratégia", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Erro ao adicionar estratégia:", error);
      enqueueSnackbar("Erro ao adicionar estratégia", { variant: "error" });
    }
  };

  // Deletar uma estratégia
  const deleteEstrategia = async (id) => {
    const confirm = await showConfirmDialog(
      "Excluir Estratégia",
      `Tem certeza que deseja excluir esta estratégia?`
    );

    if (!confirm) return;

    try {
      const response =
        await window.api?.sqlite?.estrategiaDB?.deleteEstrategia(id);

      if (response.status === 200) {
        enqueueSnackbar("Estratégia deletada com sucesso!", {
          variant: "success",
        });
        refreshData();
      } else {
        enqueueSnackbar(response.message || "Erro ao excluir estratégia", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Erro ao excluir estratégia:", error);
      enqueueSnackbar("Erro ao excluir estratégia", { variant: "error" });
    }
  };

  // Atualizar uma estratégia
  const updateEstrategia = async (id, data) => {
    try {
      const updatedData = { ...data, id };
      const response =
        await window.api?.sqlite?.estrategiaDB?.updateEstrategia(updatedData);

      if (response.status === 200) {
        enqueueSnackbar("Estratégia atualizada com sucesso!", {
          variant: "success",
        });
        refreshData();
      } else {
        enqueueSnackbar(response.message || "Erro ao atualizar estratégia", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar estratégia:", error);
      enqueueSnackbar("Erro ao atualizar estratégia", { variant: "error" });
    }
  };

  return (
    <>
    <ConfirmDialogComponent />
      <BoxDefault>
        <Button
          sx={{ margin: "10px 0px", padding: "5px 10px" }}
          size="small"
          variant={"contained"}
          onClick={handleOpenAddModal}
        >
          Adicionar Estratégia
        </Button>

        <h2 style={{ margin: "10px 0px" }}>Lista de Estratégias</h2>
        <List>
          {estrategias.map((estrategia) => (
            <ListItem key={estrategia.id}>
              <CardEstrategia
                id={estrategia.id}
                nome={estrategia.nome}
                descricao={estrategia.descricao}
                gain={estrategia.gain}
                loss={estrategia.loss}
                ativo_id={estrategia.ativo_id}
                deleteEstrategia={handleDelete}
                handleOpen={handleOpenUpdateModal}
              />
            </ListItem>
          ))}
        </List>
      </BoxDefault>
      <Modal
        type="add"
        open={openAddModal}
        onClose={handleCloseAddModal}
        ativos={ativos}
        onSubmit={addEstrategia}
      />
      <Modal
        type="update"
        open={openUpdateModal}
        onClose={handleCloseUpdateModal}
        estrategia={estrategias.find((a) => a.id === selectedEstrategiaId)}
        ativos={ativos}
        onSubmit={updateEstrategia}
      />
    </>
  );
}

export default Estrategias;
