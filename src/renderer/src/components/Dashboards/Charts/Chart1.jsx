import React from "react";
import useData from "../../../hooks/useData";
import { PieChart, Pie, Tooltip, Cell } from 'recharts';

// Gráfico de pizza de gain e loss
const Chart1 = () => {
  const { operacoes, loading, error } = useData();

//   console.log("operacoes", operacoes);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // return <GraphComponent data={data.chart1} />;
  function generatePieChartData(data, filterMonth, filterYear) {
    // Filtro de dados por mês e ano
    const filteredData = data.filter((operation) => {
      const operationDate = new Date(operation.data);
      return (
        operationDate.getMonth() + 1 === filterMonth &&
        operationDate.getFullYear() === filterYear
      );
    });
  
    // Contagem de resultados positivos e negativos
    const { positiveCount, negativeCount } = filteredData.reduce(
      (acc, operation) => {
        if (operation.resultado_pnts >= 0) {
          acc.positiveCount++;
        } else {
          acc.negativeCount++;
        }
        return acc;
      },
      { positiveCount: 0, negativeCount: 0 }
    );
  
    // Retorno no formato esperado
    return [
      { name: "Gain", value: positiveCount },
      { name: "Loss", value: negativeCount },
    ];
  }

  const COLORS = ["#0088FE", "#c400aa"];
  const result = generatePieChartData(operacoes, 12, 2024);

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={result}
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
        dataKey="value"
      >
        {result.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};

export default Chart1;
