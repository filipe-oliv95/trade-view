import React, { useEffect, useState, useContext } from "react";
import { Container, Cards } from "./styled";
import EquityGrowthChart from "../../components/Dashboards/Charts/EquityGrowthChart";
import DailyFinancialBarChart from "../../components/Dashboards/Charts/DailyFinancialBarChart";
import OperationsSummaryCard from "../../components/Dashboards/Cards/OperationsSummaryCard";
import FinanceResultCard from "../../components/Dashboards/Cards/FinanceResultCard";
import PerformanceOverviewCard from "../../components/Dashboards/Cards/PerformanceOverviewCard";
import dayjs from "dayjs";
import StrategyTable from "../../components/Dashboards/Tables/StrategyTable";
import { Box } from "@mui/system";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "@mui/material";
import { DataContext } from "../../context/DataContext";
import Typography from "@mui/material/Typography";
import DashboardFilter from "../../components/Dashboards/Filter";

function Dashboards() {
  const { ativos, estrategias, operacoes } = useContext(DataContext);

  const [startDate, setStartDate] = useState("1900-12-01 00:00:00"); // 1900-12-01 00:00:00
  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD")); // 2025-02-14
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dataset, setDataset] = useState(null);
  const [financialMetrics, setFinancialMetrics] = useState(null);
  const [strategiesData, setStrategiesData] = useState(null);
  const [selectedStrategyId, setSelectedStrategyId] = useState(null);

  function resetDashboardState() {
    setSelectedStrategyId(null);
    setStartDate("1900-12-01");
    setEndDate(dayjs().format("YYYY-MM-DD"));
  }

  const exportPDF = () => {
    const dashboardElement = document.getElementById("dashboard-content"); // Certifique-se de que o contêiner tem esse ID

    html2canvas(dashboardElement, {
      scale: 2,
      backgroundColor: null,
      useCORS: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png"); // Converte a imagem para PNG
      const pdf = new jsPDF("p", "mm", "a4");

      // Calcula a altura proporcional ao conteúdo capturado
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("dashboard.pdf"); // Nome do arquivo de saída
    });
  };

  // gera os dados para os gráficos "Lucros e Prejuízos do Dia" e "Evolução de Patrimônio"
  function generateDataset(operacoes, startDate, endDate, selectedStrategyId) {
    // console.log("startDate", startDate) // 1900-12-01 00:00:00
    // console.log("endDate", endDate) // 2025-02-14

    const [startDatePart, startTimePart] = startDate.split(" ");
    const start = new Date(`${startDatePart}T${startTimePart}-03:00`); // Fri Nov 30 1900 23:53:32 GMT-0306 (Horário Padrão de Brasília)

    const end = new Date(`${endDate}T00:00:00-03:00`); // Feb 14 2025 00:00:00 GMT-0300 (Horário Padrão de Brasília)

    let acumulado = 0;
    const resultMap = new Map();

    // Filtrar operações e ordenar por data
    operacoes
      .filter((operacao) => {
        // const operacaoDate = new Date(`${operacao.data}T00:00:00-03:00`);
        const operacaoDate = new Date(operacao.data_hora); // Wed Jan 29 2025 10:53:00 GMT-0300 (Horário Padrão de Brasília
        // Filtrar por data
        const isWithinDateRange = operacaoDate >= start && operacaoDate <= end;
        // Filtrar por estratégia selecionada (se houver)
        const isSameStrategy =
          selectedStrategyId !== null
            ? operacao.estrategia_id === selectedStrategyId
            : true;
        return isWithinDateRange && isSameStrategy;
      })
      .sort((a, b) => new Date(a.data) - new Date(b.data))
      .forEach((operacao) => {
        const ativo_id = operacao?.ativo_id;
        const valor_ativo = ativos.find(
          (a) => ativo_id === a.id
        )?.valor_contrato;
        const operacaoDate = new Date(operacao.data_hora);
        const diaOperado = operacaoDate.toISOString().split("T")[0]; // "YYYY-MM-DD"
        const valorDia =
          operacao.resultado_pnts * operacao.n_contratos * valor_ativo;

        // Acumula o valor no mesmo dia
        if (resultMap.has(diaOperado)) {
          const existing = resultMap.get(diaOperado);
          existing.valor_dia += valorDia;
          existing.valor_acumulado = acumulado + valorDia;
          acumulado = existing.valor_acumulado; // Atualiza o acumulado
          existing.qntd_operacoes += 1;
        } else {
          acumulado += valorDia;
          resultMap.set(diaOperado, {
            data: new Date(`${diaOperado}T12:00:00`),
            valor_dia: valorDia,
            valor_acumulado: acumulado,
            qntd_operacoes: 1,
          });
        }
      });

    // Converte o Map em array ordenado
    return Array.from(resultMap.values());
  }

  // gera os dados para os cards "Resumo Geral de Operações", Distribuições de Operações e "Indicadores de Performance"
  function generateFinancialMetrics(
    operacoes,
    ativos,
    startDate,
    endDate,
    selectedStrategyId
  ) {
    // console.log("startDate", startDate) // 1900-12-01 00:00:00
    // console.log("endDate", endDate) // 2025-02-14

    const [startDatePart, startTimePart] = startDate.split(" ");
    const start = new Date(`${startDatePart}T${startTimePart}-03:00`); // Fri Nov 30 1900 23:53:32 GMT-0306 (Horário Padrão de Brasília)

    const end = new Date(`${endDate}T00:00:00-03:00`); // Feb 14 2025 00:00:00 GMT-0300 (Horário Padrão de Brasília)

    let qntd_gain = 0;
    let qntd_loss = 0;
    let total_gain = 0;
    let total_loss = 0;

    // Filtrar operações e ordenar por data
    operacoes
      .filter((operacao) => {
        // const operacaoDate = new Date(`${operacao.data}T00:00:00-03:00`);
        const operacaoDate = new Date(operacao.data_hora);
        // Filtrar por data
        const isWithinDateRange = operacaoDate >= start && operacaoDate <= end;
        // Filtrar por estratégia selecionada (se houver)
        const isSameStrategy =
          selectedStrategyId !== null
            ? operacao.estrategia_id === selectedStrategyId
            : true;
        return isWithinDateRange && isSameStrategy;
      })
      .sort((a, b) => new Date(a.data) - new Date(b.data))
      .forEach((operacao) => {
        const ativo_id = operacao?.ativo_id;
        const valor_ativo = ativos.find(
          (a) => ativo_id === a.id
        )?.valor_contrato;
        if (operacao?.resultado_pnts >= 0) {
          qntd_gain += 1;
          total_gain +=
            operacao?.n_contratos * operacao?.resultado_pnts * valor_ativo;
        } else {
          qntd_loss += 1;
          total_loss +=
            operacao?.n_contratos * operacao?.resultado_pnts * valor_ativo;
        }
      });
    const normalize = (v) => Number.parseFloat(v.toFixed(2));
    const avgGain = total_gain / qntd_gain;
    const avgLoss = Math.abs(total_loss) / qntd_loss;
    return [
      { label: "Taxa de Acerto", value: qntd_gain / (qntd_gain + qntd_loss) },
      { label: "Breakeven", value: avgLoss / (avgGain + avgLoss) },
      { label: "Fator de Risco", value: avgGain / avgLoss },
      {
        label: "Fator de Lucro",
        value: Math.abs(total_gain) / Math.abs(total_loss),
      },

      { label: "Quantidade de Ganhos", value: qntd_gain },
      { label: "Quantidade de Perdas", value: qntd_loss },
      { label: "Total de Operações", value: qntd_gain + qntd_loss },
      { label: "Total de Ganhos", value: total_gain },
      { label: "Total de Perdas", value: Math.abs(total_loss) },
      { label: "Total Financeiro", value: total_gain + total_loss },
      { label: "Média de Gain", value: avgGain },
      { label: "Média de Loss", value: avgLoss },
      {
        label: "Fator de Lucro",
        value: normalize(Math.abs(total_gain) / Math.abs(total_loss)),
      },
      {
        label: "Porcentagem de Ganhos",
        value: normalize((100 * qntd_gain) / (qntd_gain + qntd_loss)),
      },
      {
        label: "Porcentagem de Perdas",
        value: normalize((100 * qntd_loss) / (qntd_gain + qntd_loss)),
      },
    ];
  }

  // gera os dados para a tabela de "Desempenho por Estratégia"
  function generateStrategiesTableData(
    operacoes,
    ativos,
    estrategias,
    startDate,
    endDate
  ) {
    // console.log("startDate", startDate) // 1900-12-01 00:00:00
    // console.log("endDate", endDate) // 2025-02-14

    const [startDatePart, startTimePart] = startDate.split(" ");
    const start = new Date(`${startDatePart}T${startTimePart}-03:00`); // Fri Nov 30 1900 23:53:32 GMT-0306 (Horário Padrão de Brasília)

    const end = new Date(`${endDate}T00:00:00-03:00`); // Feb 14 2025 00:00:00 GMT-0300 (Horário Padrão de Brasília)

    const rawRows = [];

    estrategias.forEach((e) => {
      const ativo = ativos.find((a) => e.ativo_id === a.id)?.sigla;
      const ativo_id = e.ativo_id;
      const estrategia = e.nome;
      const estrategia_id = e.id;
      const gain_fin = 0;
      const gain_qnt = 0;
      const loss_fin = 0;
      const loss_qnt = 0;
      const total_fin = 0;
      const total_qnt = 0;

      rawRows.push({
        ativo,
        ativo_id,
        estrategia,
        estrategia_id,
        gain_fin,
        gain_qnt,
        loss_fin,
        loss_qnt,
        total_fin,
        total_qnt,
      });
    });

    // Filtrar operações e ordenar por data
    operacoes
      .filter((operacao) => {
        // const operacaoDate = new Date(`${operacao.data}T00:00:00-03:00`);
        const operacaoDate = new Date(operacao.data_hora);
        return operacaoDate >= start && operacaoDate <= end;
      })
      .sort((a, b) => new Date(a.data) - new Date(b.data))
      .forEach((operacao) => {
        const ativo_id = operacao?.ativo_id;
        const estrategia_id = operacao?.estrategia_id;
        const n_contratos = operacao?.n_contratos;
        const resultado_pnts = operacao?.resultado_pnts;
        const valor_contrato = ativos.find(
          (a) => a.id === ativo_id
        )?.valor_contrato;

        // somar os valores de gain_fin (se resultado_pnts >= 0, somar resultado_pnts * valor_contrato *n_contratos ), gain_qnt (se resultado_pnts >= 0, somar 1),        loss_fin (se resultado_pnts < 0, somar resultado_pnts * valor_contrato *n_contratos ),        loss_qnt (se resultado_pnts < 0, somar 1),       total_fin (somar gain_fin + loss_fin), no rawRows de acordo com a estrategia,        total_qnt (somar gain_qnt + loss_qnt), no rawRows de acordo com a estrategia
        // Calcula o valor financeiro da operação
        const valor_operacao = resultado_pnts * valor_contrato * n_contratos;

        // Busca o índice da estratégia no rawRows
        const estrategiaIndex = rawRows.findIndex(
          (row) => row.estrategia_id === estrategia_id
        );

        if (estrategiaIndex !== -1) {
          // Se a estratégia já existe no rawRows, atualiza os valores
          const row = rawRows[estrategiaIndex];

          if (resultado_pnts >= 0) {
            row.gain_fin += valor_operacao;
            row.gain_qnt += 1;
          } else {
            row.loss_fin += valor_operacao;
            row.loss_qnt += 1;
          }

          row.total_fin = row.gain_fin + row.loss_fin;
          row.total_qnt = row.gain_qnt + row.loss_qnt;
        } else {
          // Se a estratégia não existe no rawRows, cria uma nova entrada
          rawRows.push({
            estrategia_id, // Adiciona o ID da estratégia
            ativo: ativos.find((a) => a.id === ativo_id)?.sigla,
            estrategia: estrategias.find((e) => e.id === estrategia_id)?.nome,
            gain_fin: resultado_pnts >= 0 ? valor_operacao : 0,
            gain_qnt: resultado_pnts >= 0 ? 1 : 0,
            loss_fin: resultado_pnts < 0 ? valor_operacao : 0,
            loss_qnt: resultado_pnts < 0 ? 1 : 0,
            total_fin: valor_operacao, // Inicializa como o valor da operação
            total_qnt: 1, // Inicializa com 1 operação
          });
        }
      });

    // Filtra os elementos com total_qnt > 0
    const filteredRows = rawRows.filter((row) => row.total_qnt > 0);

    return filteredRows;
  }

  useEffect(() => {
    if (operacoes.length > 0) {
      const generated = generateDataset(
        operacoes,
        startDate,
        endDate,
        selectedStrategyId
      );
      setDataset(generated);

      const generatedFinancialMetrics = generateFinancialMetrics(
        operacoes,
        ativos,
        startDate,
        endDate,
        selectedStrategyId
      );
      setFinancialMetrics(generatedFinancialMetrics);

      const generatedStrategiesTableData = generateStrategiesTableData(
        operacoes,
        ativos,
        estrategias,
        startDate,
        endDate,
        selectedStrategyId
      );
      setStrategiesData(generatedStrategiesTableData);
    }
  }, [operacoes, startDate, endDate, selectedStrategyId]);

  return (
    <div id="dashboard-content">
      <Container>
        {dataset && dataset.length > 0 ? (
          <Box style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <DashboardFilter
              showDatePicker={showDatePicker}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              endDate={endDate}
              setShowDatePicker={setShowDatePicker}
              exportPDF={exportPDF}
            />
            <Cards>
              <Box style={{ gridArea: "finance" }}>
                <FinanceResultCard dataset={financialMetrics} />
              </Box>
              <Box style={{ gridArea: "operations" }}>
                <OperationsSummaryCard dataset={financialMetrics} />
              </Box>
              <Box style={{ gridArea: "performance" }}>
                <PerformanceOverviewCard dataset={financialMetrics} />
              </Box>
              <Box style={{ gridArea: "strategy" }}>
                <StrategyTable
                  strategiesData={strategiesData}
                  onRowSelect={setSelectedStrategyId}
                  selectedStrategyId={selectedStrategyId}
                />
              </Box>
            </Cards>
            <DailyFinancialBarChart dataset={dataset} />
            <EquityGrowthChart dataset={dataset} />
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography align="center">
              Nenhum registro encontrado...
            </Typography>
            <Button onClick={resetDashboardState}>
              Retornar ao Dashboard Completo
            </Button>
          </Box>
        )}
      </Container>
    </div>
  );
}

export default Dashboards;
