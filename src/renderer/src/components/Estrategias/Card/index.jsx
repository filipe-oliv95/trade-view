import React, { useEffect, useCallback } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function CardEstrategia({
  id,
  nome,
  descricao,
  gain,
  loss,
  ativo_id,
  deleteEstrategia,
  handleOpen,
}) {
  const [ativo, setAtivo] = React.useState(null);

  const getAtivoById = useCallback(async (ativo_id) => {
    try {
      const data = await window.api?.sqlite?.ativoDB?.getAtivoById(ativo_id);
      setAtivo(data);
    } catch (error) {
      console.error("Erro ao buscar o ativo:", error);
    }
  }, []); 
  
  useEffect(() => {
    getAtivoById(ativo_id);
  }, [getAtivoById, ativo_id]);

  function FatorRisco() {
    return (gain / loss).toFixed(2);
  }

  function Breakeven() {
    const fatorRisco = gain / loss;
    return ( (1 / (1 + fatorRisco)) * 100 ).toFixed(2);
  }


  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {nome}
        </Typography>
        <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 14 }}>
          {descricao}
        </Typography>
        {ativo && (
          <>
            <Typography sx={{ color: "text.secondary" }}>
              Ativo: {ativo?.data?.sigla}
            </Typography>
          </>
        )}
        <Typography sx={{ color: "text.secondary" }}>
          Gain: {gain?.toString()} pontos
        </Typography>
        <Typography sx={{ color: "text.secondary" }}>
          Loss: {loss} pontos
        </Typography>
        <Typography sx={{ color: "text.secondary" }}>
          Fator de Risco: {FatorRisco()}
        </Typography>
        <Typography sx={{ color: "text.secondary" }}>
          Breakeven: {Breakeven()}%
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" variant="outlined" onClick={() => handleOpen(id)}>
          Atualizar
        </Button>
        <Button
          size="small"
          variant="text"
          onClick={() => deleteEstrategia(id)}
        >
          Deletar
        </Button>
      </CardActions>
    </Card>
  );
}
