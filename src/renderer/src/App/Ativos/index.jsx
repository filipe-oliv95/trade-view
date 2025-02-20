import React, { useState, useContext } from "react";
import CardAtivo from "../../components/Ativos/Card";
import Modal from "../../components/Ativos/Modal";
import { List, ListItem } from "./styled";
import { Button } from "@mui/material";
import BoxDefault from "../../components/shared/BoxDefault";
import { DataContext } from "../../context/DataContext";
import { useSnackbar } from "notistack";
import useConfirmDialog from "../../hooks/useConfirmDialog";

function Ativos() {
  const { ativos, loading, error, refreshData,  } = useContext(DataContext);
  const { enqueueSnackbar } = useSnackbar();
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();

  const [selectedAtivoId, setSelectedAtivoId] = useState(0);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error.message}</p>;

  const handleDelete = async (id) => {
    await deleteAtivo(id, refreshData, showConfirmDialog);
  };

  const handleOpenUpdateModal = (id) => {
    setSelectedAtivoId(id);
    setOpenUpdateModal(true);
  };
  const handleCloseUpdateModal = () => {
    setSelectedAtivoId(null);
    setOpenUpdateModal(false);
  };

  const handleOpenAddModal = (id) => {
    setSelectedAtivoId(id);
    setOpenAddModal(true);
  };
  const handleCloseAddModal = () => {
    setSelectedAtivoId(null);
    setOpenAddModal(false);
  };

  // Adicionar um ativo
  const addAtivo = async (data) => {
    try {
      const response = await window.api?.sqlite?.ativoDB?.addAtivo(data);

      if (response.status === 201) {
        enqueueSnackbar("Ativo adicionado com sucesso!", {
          variant: "success",
        });
        refreshData();
      } else {
        enqueueSnackbar(response.message || "Erro ao adicionar ativo", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Erro ao adicionar ativo:", error);
      enqueueSnackbar("Erro ao adicionar ativo", { variant: "error" });
    }
  };

  // Deletar um ativo
  const deleteAtivo = async (id) => {
    const confirm = await showConfirmDialog(
      "Excluir Ativo",
      `Tem certeza que deseja excluir este ativo?`
    );
    
    if (!confirm) return;

    try {
      const response = await window.api?.sqlite?.ativoDB?.deleteAtivo(id);

      if (response.status === 200) {
        enqueueSnackbar("Ativo deletado com sucesso!", { variant: "success" });
        refreshData();
      } else {
        enqueueSnackbar(response.message || "Erro ao excluir ativo", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Erro ao excluir ativo:", error);
      enqueueSnackbar("Erro ao excluir ativo", { variant: "error" });
    }
  };

  // Atualizar um ativo
  const updateAtivo = async (id, data) => {
    try {
      const updatedData = { ...data, id };
      const response =
        await window.api?.sqlite?.ativoDB?.updateAtivo(updatedData);

      if (response.status === 200) {
        enqueueSnackbar("Ativo atualizado com sucesso!", {
          variant: "success",
        });
        refreshData();
      } else {
        enqueueSnackbar(response.message || "Erro ao atualizar ativo", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar ativo:", error);
      enqueueSnackbar("Erro ao atualizar ativo", { variant: "error" });
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
          Adicionar Ativo
        </Button>

        <h2 style={{ margin: "10px 0px" }}>Lista de Ativos</h2>
        <List>
          {ativos?.map((ativo) => (
            <ListItem key={ativo.id}>
              <CardAtivo
                id={ativo.id}
                sigla={ativo.sigla}
                descricao={ativo.descricao}
                valor_contrato={ativo.valor_contrato}
                deleteAtivo={handleDelete}
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
        ativo={ativos.find((a) => a.id === selectedAtivoId)}
        onSubmit={addAtivo}
      />
      <Modal
        type="update"
        open={openUpdateModal}
        onClose={handleCloseUpdateModal}
        ativo={ativos.find((a) => a.id === selectedAtivoId)}
        onSubmit={updateAtivo}
      />
    </>
  );
}

export default Ativos;
