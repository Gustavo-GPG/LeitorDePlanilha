import { Table, PieChart, BarChart } from 'lucide-react';

interface BotoesVisualizacaoProps {
  viewMode: 'table' | 'pie' | 'doughnut' | 'bar' | 'stacked-bar' | 'horizontal-bar';
  setViewMode: (mode: 'table' | 'pie' | 'doughnut' | 'bar' | 'stacked-bar' | 'horizontal-bar') => void;
}

/**
 * Componente que renderiza os botões para alternar entre diferentes tipos de visualização
 * @param viewMode - Modo atual de visualização
 * @param setViewMode - Função para alterar o modo de visualização
 */
function BotoesVisualizacao({ viewMode, setViewMode }: BotoesVisualizacaoProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <button
        onClick={() => setViewMode('table')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          viewMode === 'table'
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:text-white'
        }`}
      >
        <Table size={20} />
        Tabela
      </button>
      <button
        onClick={() => setViewMode('pie')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          viewMode === 'pie'
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:text-white'
        }`}
      >
        <PieChart size={20} />
        Pizza
      </button>
      <button
        onClick={() => setViewMode('doughnut')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          viewMode === 'doughnut'
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:text-white'
        }`}
      >
        <PieChart size={20} />
        Rosca
      </button>
      <button
        onClick={() => setViewMode('bar')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          viewMode === 'bar'
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:text-white'
        }`}
      >
        <BarChart size={20} />
        Barras
      </button>
      <button
        onClick={() => setViewMode('stacked-bar')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          viewMode === 'stacked-bar'
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:text-white'
        }`}
      >
        <BarChart size={20} />
        Barras Empilhadas
      </button>
      <button
        onClick={() => setViewMode('horizontal-bar')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          viewMode === 'horizontal-bar'
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:text-white'
        }`}
      >
        <BarChart size={20} className="rotate-90" />
        Barras Horizontais
      </button>
    </div>
  );
}

export default BotoesVisualizacao;