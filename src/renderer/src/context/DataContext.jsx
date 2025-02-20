import React, { createContext, useState, useEffect, useCallback } from "react";
import { SnackbarProvider } from "notistack";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [ativos, setAtivos] = useState([]);
  const [estrategias, setEstrategias] = useState([]);
  const [operacoes, setOperacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const ativosResponse = await window.api?.sqlite?.ativoDB?.getAllAtivos();
      setAtivos(ativosResponse?.data || []);

      const estrategiasResponse =
        await window.api?.sqlite?.estrategiaDB?.getAllEstrategias();
      setEstrategias(estrategiasResponse?.data || []);

      const operacoesResponse =
        await window.api?.sqlite?.operacaoDB?.getAllOperacoes();
      setOperacoes(operacoesResponse?.data || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <SnackbarProvider maxSnack={3}>
      <DataContext.Provider
        value={{
          ativos,
          estrategias,
          operacoes,
          loading,
          error,
          refreshData: fetchData,
        }}
      >
        {children}
      </DataContext.Provider>
    </SnackbarProvider>
  );
};