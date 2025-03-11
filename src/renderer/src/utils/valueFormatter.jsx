export function barChartValueFormatter(value) {
  // Verifica se o valor é negativo e calcula o valor absoluto para aplicar o formato
  const isNegative = value < 0;
  value = Math.abs(value);

  let formattedValue = "";
  // Se o valor for maior que 1 milhão, formate como "1.254M"
  if (value >= 1000000) {
    formattedValue = (value / 1000000).toFixed(2) + "M";
  }
  // Se o valor for maior que 1 mil, formate como "1.254k"
  else if (value >= 1000) {
    formattedValue = (value / 1000).toFixed(1) + "k";
  }
  // Caso o valor seja menor que 1000, formate como "0.54k", etc.
  else if (value >= 100) {
    formattedValue = (value / 1000).toFixed(2) + "k";
  }
  // Caso o valor seja menor que 1000, formate como "0.54k", etc.
  else {
    formattedValue = value.toFixed(1);
  }
  // Se o valor original for negativo, adiciona o sinal de negativo
  if (isNegative) {
    formattedValue = "-" + formattedValue;
  }
  return formattedValue;
}

export function valueFormatter(value) {
  // Verifica se o valor é negativo e calcula o valor absoluto para aplicar o formato
  const isNegative = value < 0;
  value = Math.abs(value);

  let formattedValue = "";
  // Se o valor for maior que 1 milhão, formate como "1.254M"
  if (value >= 1000000) {
    formattedValue = (value / 1000000).toFixed(2) + "M";
  }
  // Se o valor for maior que 1 mil, formate como "1.254k"
  else if (value >= 1000) {
    formattedValue = (value / 1000).toFixed(1) + "k";
  }
  // Caso o valor seja menor que 1000, formate como "0.54k", etc.
  else if (value >= 100) {
    formattedValue = (value / 1000).toFixed(2) + "k";
  }
  // Caso o valor seja menor que 1000, formate como "0.54k", etc.
  else {
    formattedValue = value.toFixed(1);
  }
  // Se o valor original for negativo, adiciona o sinal de negativo
  if (isNegative) {
    formattedValue = "-" + formattedValue;
  }
  return formattedValue;
}
