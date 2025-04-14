import { Pie, Bar, Doughnut } from 'react-chartjs-2';

interface GraficosProps {
  viewMode: 'pie' | 'doughnut' | 'bar' | 'stacked-bar' | 'horizontal-bar';
  chartData: any;
  chartColumn: string;
  aggregateColumn: string;
}

/**
 * Componente que renderiza os diferentes tipos de gráficos
 * @param props - Propriedades do componente incluindo tipo de gráfico e dados
 */
function Graficos({ viewMode, chartData, chartColumn, aggregateColumn }: GraficosProps) {
  if (!chartData) return null;

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: 'white',
        },
      },
      title: {
        display: true,
        text: `${chartColumn} por ${aggregateColumn}`,
        color: 'white',
      },
    },
  };

  switch (viewMode) {
    case 'pie':
      return <Pie data={chartData} options={commonOptions} />;
    case 'doughnut':
      return <Doughnut data={chartData} options={commonOptions} />;
    case 'bar':
    case 'stacked-bar':
    case 'horizontal-bar':
      return (
        <Bar
          data={chartData}
          options={{
            ...commonOptions,
            indexAxis: viewMode === 'horizontal-bar' ? 'y' : 'x',
            scales: {
              x: {
                stacked: viewMode === 'stacked-bar',
                ticks: { color: 'white' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
              },
              y: {
                stacked: viewMode === 'stacked-bar',
                beginAtZero: true,
                ticks: { color: 'white' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
              },
            },
          }}
        />
      );
    default:
      return null;
  }
}

export default Graficos;