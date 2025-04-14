/**
 * Processa os dados do gráfico para visualização
 * @param filteredData - Dados filtrados da tabela
 * @param chartColumn - Coluna selecionada para categorias
 * @param aggregateColumn - Coluna selecionada para valores
 * @param secondaryChartColumn - Coluna secundária para gráficos hierárquicos
 * @param viewMode - Tipo de visualização selecionada
 * @returns Dados formatados para o gráfico
 */
export function processChartData(
  filteredData: any[],
  chartColumn: string,
  aggregateColumn: string,
  secondaryChartColumn: string,
  viewMode: string
) {
  if (!chartColumn || !aggregateColumn) return null;

  let data: Record<string, number | Record<string, number>> = {};
  
  if (secondaryChartColumn && (viewMode === 'stacked-bar' || viewMode === 'doughnut')) {
    filteredData.forEach(row => {
      const primaryKey = String(row[chartColumn] || 'N/A');
      const secondaryKey = String(row[secondaryChartColumn] || 'N/A');
      const value = parseFloat(row[aggregateColumn]) || 0;

      if (!data[primaryKey]) {
        data[primaryKey] = {};
      }
      
      if (typeof data[primaryKey] === 'object') {
        const subData = data[primaryKey] as Record<string, number>;
        subData[secondaryKey] = (subData[secondaryKey] || 0) + value;
      }
    });
  } else {
    data = filteredData.reduce((acc, row) => {
      const key = String(row[chartColumn] || 'N/A');
      const value = parseFloat(row[aggregateColumn]) || 0;
      acc[key] = (acc[key] || 0) + value;
      return acc;
    }, {} as Record<string, number>);
  }

  const generateColors = (count: number) => 
    Array.from({ length: count }, () => `hsl(${Math.random() * 360}, 70%, 50%)`);

  if (typeof Object.values(data)[0] === 'object') {
    const labels = Object.keys(data);
    const secondaryLabels = Array.from(
      new Set(
        Object.values(data)
          .flatMap(subData => Object.keys(subData as Record<string, number>))
      )
    );
    
    const datasets = secondaryLabels.map((secondary, index) => ({
      label: secondary,
      data: labels.map(label => 
        ((data[label] as Record<string, number>)[secondary] || 0)
      ),
      backgroundColor: generateColors(1)[0],
      stack: viewMode === 'stacked-bar' ? 'stack1' : undefined,
    }));

    return {
      labels,
      datasets,
    };
  } else {
    const labels = Object.keys(data);
    const values = Object.values(data) as number[];
    const colors = generateColors(labels.length);

    return {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colors,
        borderColor: colors.map(color => color.replace('0.5', '1')),
        borderWidth: 1,
      }],
    };
  }
}