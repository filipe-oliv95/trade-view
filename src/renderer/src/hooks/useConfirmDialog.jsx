import { useState, useCallback } from "react";
import ConfirmDialog from "../components/shared/ConfirmDialog";

const useConfirmDialog = () => {
  const [dialogConfig, setDialogConfig] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
    onClose: () => {},
  });

  const showConfirmDialog = useCallback((title, message) => {
    return new Promise((resolve) => {
      setDialogConfig({
        open: true,
        title,
        message,
        onConfirm: () => {
          resolve(true);
          setDialogConfig((prev) => ({ ...prev, open: false }));
        },
        onClose: () => {
          resolve(false);
          setDialogConfig((prev) => ({ ...prev, open: false }));
        },
      });
    });
  }, []);

  const ConfirmDialogComponent = () => (
    <ConfirmDialog
      open={dialogConfig.open}
      title={dialogConfig.title}
      message={dialogConfig.message}
      onClose={dialogConfig.onClose}
      onConfirm={dialogConfig.onConfirm}
    />
  );

  return { showConfirmDialog, ConfirmDialogComponent };
};

export default useConfirmDialog;
