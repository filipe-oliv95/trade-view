import React from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const ConfirmDialog = ({ open, onClose = () => {}, onConfirm = () => {}, title, message }) => {
  return (
    <Dialog fullWidth open={open} onClose={() => onClose(null)} disableEscapeKeyDown>
      <DialogTitle>{title || "Confirmação"}</DialogTitle>
      <DialogContent>
        <Typography>{message || "Tem certeza que deseja prosseguir?"}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
};

export default ConfirmDialog;
