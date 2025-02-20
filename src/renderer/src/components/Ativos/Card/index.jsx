import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function CardAtivo({ id, sigla, descricao, valor_contrato, deleteAtivo, handleOpen }) {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {sigla}
        </Typography>
        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
          {descricao}
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>Valor por Ponto: R${valor_contrato}</Typography>
      </CardContent>
      <CardActions sx={{  }}>
        <Button size="small" variant="outlined" onClick={() => handleOpen(id)}>Atualizar</Button>
        <Button size="small" variant="text" onClick={() => deleteAtivo(id)}>
          Deletar
        </Button>
      </CardActions>
    </Card>
  );
}