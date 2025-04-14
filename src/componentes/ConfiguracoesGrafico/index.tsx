interface ConfiguracoesGraficoProps {
  headers: string[];
  chartColumn: string;
  setChartColumn: (value: string) => void;
  secondaryChartColumn: string;
  setSecondaryChartColumn: (value: string) => void;
  aggregateColumn: string;
  setAggregateColumn: (value: string) => void;
  viewMode: string;
}

/**
 * Componente para configuração dos parâmetros do gráfico
 * @param props - Propriedades do componente incluindo headers e funções de configuração
 */
function ConfiguracoesGrafico({
  headers,
  chartColumn,
  setChartColumn,
  secondaryChartColumn,
  setSecondaryChartColumn,
  aggregateColumn,
  setAggregateColumn,
  viewMode
}: ConfiguracoesGraficoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-gray-700 p-4 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Coluna para Categorias
        </label>
        <select
          value={chartColumn}
          onChange={(e) => setChartColumn(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">Selecione uma coluna</option>
          {headers.map(header => (
            <option key={header} value={header}>{header}</option>
          ))}
        </select>
      </div>
      {(viewMode === 'stacked-bar' || viewMode === 'doughnut') && (
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Subcategorias
          </label>
          <select
            value={secondaryChartColumn}
            onChange={(e) => setSecondaryChartColumn(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Selecione uma coluna</option>
            {headers.map(header => (
              <option key={header} value={header}>{header}</option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Coluna para Valores (Numérica)
        </label>
        <select
          value={aggregateColumn}
          onChange={(e) => setAggregateColumn(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">Selecione uma coluna</option>
          {headers.map(header => (
            <option key={header} value={header}>{header}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default ConfiguracoesGrafico;