import React, { useState, useEffect, useContext } from "react";

import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { Button, Snackbar, Alert } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { TrendingUp, TrendingDown } from "@mui/icons-material";

import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";

import { DataContext } from "../../../context/DataContext";
import useConfirmDialog from "../../../hooks/useConfirmDialog";

import { useSnackbar } from "notistack";

const localizedTextsMap = {
  columnMenuUnsort: "não classificado",
  columnMenuSortAsc: "Classificar por ordem crescente",
  columnMenuSortDesc: "Classificar por ordem decrescente",
  columnMenuFilter: "Filtro",
  columnMenuHideColumn: "Ocultar",
  columnMenuShowColumns: "Mostrar colunas",
  columnMenuManageColumns: "Gerenciar colunas",
};

export default function FullFeaturedCrudGrid({setCsvExportRows}) {
  const theme = useTheme();

  const { ativos, estrategias, operacoes, loading, refreshData } =
    useContext(DataContext);
  const { enqueueSnackbar } = useSnackbar();
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();

  const [rows, setRows] = React.useState([]);
  const [checkRows, setCheckRows] = useState([]);
  const [editedRow, setEditedRow] = useState(null);
  const [rowModesModel, setRowModesModel] = useState({});
  const ativoOptions = ativos?.map((ativo) => ativo.sigla);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  const nomesEstrategias = estrategias.map((estrategia) => estrategia.nome);
  const [filteredEstrategias, setFilteredEstrategias] =
    useState(nomesEstrategias);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transformedOperacoes = transformOperacoes(
          operacoes,
          ativos,
          estrategias
        );
        setRows(transformedOperacoes);
        setCsvExportRows(transformedOperacoes);
        setCheckRows(transformedOperacoes);
      } catch (error) {
        console.error("Erro ao carregar operações:", error);
      }
    };

    fetchData();
  }, [ativos, estrategias, editedRow]);

  useEffect(() => {
    if (editedRow) {
      // Verificar se o ID do `editedRow` já existe em `rows`
      const isUpdate = checkRows.some((row) => row.id === editedRow.id);
      const valor_contrato =
        ativos.find((ativo) => ativo.sigla === editedRow.ativo)
          ?.valor_contrato || 0;
      const resultado_fin =
        editedRow.n_contratos * editedRow.resultado_pnts * valor_contrato;

      const data = {
        ...formatRowData(editedRow),
        resultado_fin,
      };

      if (isUpdate) {
        // Atualizar a operação existente
        updateOperacao(editedRow.id, data);
      } else {
        // Adicionar nova operação
        addOperacao(data);
      }
      // Limpar o estado `editedRow`
      setEditedRow(null);
    }
  }, [editedRow, rows]);

  const handleCloseSnackbar = () => {
    setOpen(false);
  };

  const transformOperacoes = (operacoes, ativos, estrategias) => {
    return operacoes.map((operacao) => {
      const capitalizeFirstLetter = (str) =>
        str.charAt(0).toUpperCase() + str.slice(1);
      const dataFormatada = new Date(operacao.data_hora);

      return {
        id: operacao.id,
        data_hora: dataFormatada,
        duracao: operacao.duracao,
        ativo: ativos?.find((a) => a.id === operacao.ativo_id)?.sigla,
        estrategia: estrategias.find((e) => e.id === operacao.estrategia_id)
          ?.nome,
        lado: capitalizeFirstLetter(operacao.lado),
        men: operacao.men,
        mep: operacao.mep,
        n_contratos: operacao.n_contratos,
        resultado_pnts: operacao.resultado_pnts,
        resultado_fin: operacao.resultado_fin,
        isNew: false,
      };
    });
  };

  if (loading) return <p>Carregando...</p>;

  function EditToolbar(props) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
      setFilteredEstrategias([]);

      // Verifica se existe alguma linha em modo de edição
      const isEditing = Object.values(rowModesModel).some(
        (row) => row.mode === GridRowModes.Edit
      );

      if (isEditing) {
        setError(
          "Finalize a edição atual antes de adicionar uma nova operação."
        );
        setOpen(true);
        return;
      }

      const generateRandomId = () =>
        crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).substring(2, 15);
      const id = generateRandomId();

      setRows((oldRows) => [
        ...oldRows,
        {
          id,
          estrategia: "",
          ativo: "",
          data_hora: "",
          duracao: 5,
          lado: "Compra",
          men: 0,
          mep: 0,
          n_contratos: 0,
          resultado_pnts: 0,
          resultado_fin: 0,
          isNew: true,
        },
      ]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: "data" },
      }));
    };

    return (
      <GridToolbarContainer>
        <Button
          color={theme.palette.text.primary}
          startIcon={<AddIcon />}
          onClick={handleClick}
        >
          Adicionar Operação
        </Button>
      </GridToolbarContainer>
    );
  }
 
  // usado para formatar os dados antes de enviar para as funções do bd AddOperacao e UpdateOperacao
  const formatRowData = (row) => {
    console.log("row", row)
    return {
      id: row.id,
      data_hora:
        row.data_hora instanceof Date
          ? row.data_hora.toISOString()
          : row.data_hora,
      ativo_id: ativos?.find((a) => a.sigla === row.ativo)?.id,
      estrategia_id: estrategias.find((a) => a.nome === row.estrategia)?.id,
      duracao: parseInt(row.duracao, 10), // Converte para número inteiro
      lado: row.lado.toLowerCase(), // Converte para letras minúsculas ('compra' ou 'venda')
      n_contratos: parseInt(row.n_contratos, 10), // Garante que seja um número inteiro
      men: parseFloat(row.men), // Garante que seja um número decimal
      mep: parseFloat(row.mep), // Garante que seja um número decimal
      resultado_pnts: parseFloat(
        row.resultado_pnts.toString().replace(",", ".")
      ), // Garante que seja um número decimal
    };
  };

  // Adicionar um operacao
  const addOperacao = async (data) => {
    try {
      const response = await window.api?.sqlite?.operacaoDB?.addOperacao(data);

      if (response.status === 201) {
        enqueueSnackbar("Operação adicionada com sucesso!", {
          variant: "success",
        });
        refreshData();
      } else {
        enqueueSnackbar(response.message || "Erro ao adicionar operação", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Erro ao adicionar operação:", error);
      enqueueSnackbar("Erro ao adicionar operação", { variant: "error" });
    }
  };

  // Deletar um operacao
  const deleteOperacao = async (id) => {
    const confirm = await showConfirmDialog(
      "Excluir Operação",
      `Tem certeza que deseja excluir este operação?`
    );

    if (!confirm) return;

    try {
      const response = await window.api?.sqlite?.operacaoDB?.deleteOperacao(id);

      if (response.status === 200) {
        enqueueSnackbar("Operacao deletada com sucesso!", {
          variant: "success",
        });
        await refreshData();
        setRows(rows.filter((row) => row.id !== id));
        setCsvExportRows(rows.filter((row) => row.id !== id));
      } else {
        enqueueSnackbar(response.message || "Erro ao excluir operação", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Erro ao excluir operação:", error);
      enqueueSnackbar("Erro ao excluir operação", { variant: "error" });
    }
  };

  // Atualizar um operacao
  const updateOperacao = async (id, data) => {
    try {
      const updatedData = { ...data, id };

      const response =
        await window.api?.sqlite?.operacaoDB?.updateOperacao(updatedData);

      if (response.status === 200) {
        enqueueSnackbar("Operação atualizada com sucesso!", {
          variant: "success",
        });
        refreshData();
      } else {
        enqueueSnackbar(response.message || "Erro ao atualizar operação", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar operação:", error);
      enqueueSnackbar("Erro ao atualizar operação", { variant: "error" });
    }
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    // Verifica se há uma linha já em modo de edição
    const editingRowId = Object.keys(rowModesModel).find(
      (key) => rowModesModel[key]?.mode === GridRowModes.Edit
    );

    if (editingRowId) {
      setError(
        "Já há uma linha sendo editada. Conclua ou cancele antes de editar outra."
      );
      setOpen(true);
      return; // Impede a edição de outra linha
    }

    const rowBeingEdited = rows.find((row) => row.id === id);

    if (rowBeingEdited) {
      const ativoSelecionado = rowBeingEdited.ativo;

      // Filtra as estratégias com base no ativo selecionado
      if (ativoSelecionado) {
        const estrategiasFiltradas = estrategias
          .filter(
            (estrategia) =>
              estrategia.ativo_id ===
              ativos?.find((a) => a.sigla === ativoSelecionado)?.id
          )
          .map((estrategia) => estrategia.nome);

        // Atualiza o estado de filteredEstrategias
        setFilteredEstrategias(estrategiasFiltradas);
      } else {
        // Se não houver ativo, define uma lista vazia
        setFilteredEstrategias([]);
      }
    }

    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    deleteOperacao(id);
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
      setCsvExportRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    setCsvExportRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    setEditedRow(updatedRow);
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  // modelo das colunas da tabela
  const columnGroupingModel = [
    {
      groupId: "Temporalidade",
      description: "Temporalidade",
      children: [
        { field: "duracao" },
        { field: "data_hora" },
      ],
    },
    {
      groupId: "Margens de Preço",
      description: "Margens de Preço",
      children: [{ field: "men" }, { field: "mep" }],
    },
    {
      groupId: "Informações gerais",
      description: "Informações gerais da operação",
      children: [
        { field: "ativo" },
        { field: "estrategia" },
        { field: "lado" },
        { field: "n_contratos" },
      ],
    },
    {
      groupId: "Resultados",
      description: "Resultado em pontos e financeiro",
      children: [{ field: "resultado_pnts" }, { field: "resultado_fin" }],
    },
  ];

  // definição de cada coluna
  const columns = [
    {
      field: "data_hora",
      headerName: "Data e Horário",
      editable: true,
      type: "dateTime",
      width: 225,
      description: "Duração do trade em minutos",
      align: "left",
      headerAlign: "left",
    },
    {
      field: "duracao",
      headerName: "Duração",
      editable: true,
      type: "number",
      width: 110,
      description: "Duração do trade em minutos",
      align: "left",
      headerAlign: "left",
    },
    {
      field: "ativo",
      headerName: "Código do Ativo",
      editable: true,
      type: "singleSelect",
      valueOptions: ativoOptions,
      width: 120,
      description: "Ativo transacionado",
      align: "left",
      headerAlign: "left",
      preProcessEditCellProps: (params) => {
        const ativoSelecionado = ativos?.find(
          (ativo) => ativo.sigla === params.props.value
        );
        if (ativoSelecionado) {
          const estrategiasFiltradas = estrategias
            .filter(
              (estrategia) => estrategia?.ativo_id === ativoSelecionado.id
            )
            .map((estrategia) => estrategia.nome);
          setFilteredEstrategias(estrategiasFiltradas);
        }
        return params.props;
      },
    },
    {
      field: "estrategia",
      headerName: "Estratégia",
      editable: true,
      type: "singleSelect",
      valueOptions: filteredEstrategias,
      width: 140,
      description: "Estratégia utilizada",
      align: "left",
      headerAlign: "left",
    },
    {
      field: "lado",
      headerName: "Operação",
      editable: true,
      type: "singleSelect",
      valueOptions: ["Compra", "Venda"],
      width: 120,
      description: "Tipo de transação: Compra ou Venda",
      align: "left",
      headerAlign: "left",
      preProcessEditCellProps: (params) => {
        if (!params.props.value) {
          return { ...params.props, value: "Compra" };
        }
        return params.props;
      },
    },
    {
      field: "n_contratos",
      headerName: "Lote",
      editable: true,
      type: "number",
      width: 130,
      description: "Número de contratos negociados",
      align: "left",
      headerAlign: "left",
    },
    {
      field: "men",
      headerName: "MEN",
      editable: true,
      type: "number",
      width: 100,
      description: "Valor MEN relacionado à transação",
      align: "left",
      headerAlign: "left",
    },
    {
      field: "mep",
      headerName: "MEP",
      editable: true,
      type: "number",
      width: 100,
      description: "Valor MEP relacionado à transação",
      align: "left",
      headerAlign: "left",
    },
    {
      field: "resultado_pnts",
      headerName: "Pontos",
      editable: true,
      type: "number",
      width: 130,
      description: "Resultado da transação em pontos",
      align: "left",
      headerAlign: "left",
    },
    {
      field: "resultado_fin",
      headerName: "Financeiro (R$)",
      editable: false,
      type: "number",
      width: 130,
      description:
        "Resultado da transação em reais (calculado após salvar a operação)",
      align: "left",
      headerAlign: "left",
      renderCell: (params) => (
        <Typography
          variant="body2"
          color={params.value >= 0 ? "green" : "red"}
          display="flex"
          alignItems="center"
          sx={{ height: "100%" }}
        >
          {params.value >= 0 ? <TrendingUp /> : <TrendingDown />}
          &nbsp;{params.value}
        </Typography>
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Ações",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: 700,
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <ConfirmDialogComponent />
      <DataGrid
        rows={Array.isArray(rows) ? rows : []}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        experimentalFeatures={{ newEditingApi: true }}
        slots={{ toolbar: EditToolbar }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
          pagination: {
            labelRowsPerPage: "Linhas por página",
          },
        }}
        localeText={localizedTextsMap}
        columnGroupingModel={columnGroupingModel}
      />
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" onClose={handleCloseSnackbar}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
