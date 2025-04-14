import { Search, Eye, EyeOff, Trash2, X } from 'lucide-react';

interface FiltrosProps {
  headers: string[];
  filters: Record<string, string>;
  activeColumns: Record<string, boolean>;
  columnOptions: Record<string, string[]>;
  hiddenFilters: Set<string>;
  handleFilterChange: (header: string, value: string) => void;
  toggleColumn: (header: string) => void;
  toggleFilterVisibility: (header: string) => void;
  clearFilters: () => void;
  setHiddenFilters: (value: Set<string>) => void;
}

/**
 * Componente de filtros para a tabela de dados
 * @param props - Propriedades do componente incluindo estados e funções de manipulação
 */
function Filtros({
  headers,
  filters,
  activeColumns,
  columnOptions,
  hiddenFilters,
  handleFilterChange,
  toggleColumn,
  toggleFilterVisibility,
  clearFilters,
  setHiddenFilters
}: FiltrosProps) {
  const visibleFilters = headers.filter(header => !hiddenFilters.has(header));

  const getPlaceholder = (header: string): string => {
    const options = columnOptions[header] || [];
    if (!options || options.length === 0) return `Selecione uma opção`;
    
    if (options.length === 1) {
      return `Exemplo: ${options[0]}`;
    }
    
    return `Exemplos: ${options.slice(0, 3).join(', ')}...`;
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Filtros</h2>
        <div className="flex gap-2">
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white bg-gray-700 rounded-lg transition-colors"
          >
            <X size={16} />
            Limpar
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleFilters.map(header => (
          <div key={header} className="relative bg-gray-700 p-4 rounded-lg border border-gray-600">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-200">
                {header}
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleColumn(header)}
                  className={`p-1 rounded-full transition-colors ${
                    activeColumns[header]
                      ? 'text-indigo-400 hover:text-indigo-300'
                      : 'text-gray-500 hover:text-gray-400'
                  }`}
                  title={activeColumns[header] ? 'Ocultar coluna' : 'Mostrar coluna'}
                >
                  {activeColumns[header] ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button
                  onClick={() => toggleFilterVisibility(header)}
                  className="p-1 rounded-full text-red-400 hover:text-red-300 transition-colors"
                  title="Remover filtro"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="relative">
              <select
                value={filters[header]}
                onChange={(e) => handleFilterChange(header, e.target.value)}
                className={`w-full px-4 py-2 bg-gray-800 border rounded-lg transition-colors appearance-none ${
                  activeColumns[header]
                    ? 'border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white'
                    : 'border-gray-700 bg-gray-800 text-gray-500'
                }`}
                disabled={!activeColumns[header]}
              >
                <option value="">{getPlaceholder(header)}</option>
                {columnOptions[header]?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <Search 
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                  activeColumns[header] ? 'text-gray-400' : 'text-gray-600'
                }`} 
                size={18} 
              />
            </div>
          </div>
        ))}
      </div>
      {hiddenFilters.size > 0 && (
        <div className="mt-4">
          <button
            onClick={() => setHiddenFilters(new Set())}
            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Mostrar {hiddenFilters.size} {hiddenFilters.size === 1 ? 'filtro oculto' : 'filtros ocultos'}
          </button>
        </div>
      )}
    </div>
  );
}

export default Filtros;