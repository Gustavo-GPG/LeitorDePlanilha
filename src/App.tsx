import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Upload, Search, X, RotateCcw, Eye, EyeOff } from 'lucide-react';

interface FilterState {
  [key: string]: string;
}

interface FilterHistory {
  [key: string]: string;
}

interface ColumnVisibility {
  [key: string]: boolean;
}

interface ColumnExamples {
  [key: string]: string[];
}

function App() {
  const [headers, setHeaders] = useState<string[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [filters, setFilters] = useState<FilterState>({});
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [lastFilters, setLastFilters] = useState<FilterHistory>({});
  const [activeColumns, setActiveColumns] = useState<ColumnVisibility>({});
  const [columnExamples, setColumnExamples] = useState<ColumnExamples>({});

  const getUniqueValues = (data: any[], header: string): string[] => {
    const uniqueSet = new Set(
      data.map(row => String(row[header]))
        .filter(value => value !== undefined && value !== null && value !== '')
    );
    return Array.from(uniqueSet).slice(0, 3);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);
      
      if (jsonData.length > 0) {
        const headers = Object.keys(jsonData[0]);
        setHeaders(headers);
        setData(jsonData);
        setFilteredData(jsonData);
        
        const initialFilters: FilterState = {};
        const initialVisibility: ColumnVisibility = {};
        const examples: ColumnExamples = {};
        
        headers.forEach(header => {
          initialFilters[header] = '';
          initialVisibility[header] = true;
          examples[header] = getUniqueValues(jsonData, header);
        });
        
        setFilters(initialFilters);
        setActiveColumns(initialVisibility);
        setColumnExamples(examples);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFilterChange = (header: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [header]: value
    }));
  };

  const toggleColumn = (header: string) => {
    setActiveColumns(prev => ({
      ...prev,
      [header]: !prev[header]
    }));
  };

  const applyFilters = () => {
    const filtered = data.filter(row => {
      return Object.entries(filters).every(([header, filterValue]) => {
        if (!activeColumns[header] || !filterValue) return true;
        const cellValue = String(row[header]).toLowerCase();
        return cellValue.includes(filterValue.toLowerCase());
      });
    });
    setFilteredData(filtered);
    setLastFilters({...filters});
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {};
    headers.forEach(header => {
      clearedFilters[header] = '';
    });
    setFilters(clearedFilters);
  };

  const restoreLastFilters = () => {
    setFilters({...lastFilters});
  };

  useEffect(() => {
    applyFilters();
  }, [filters, activeColumns]);

  const visibleHeaders = headers.filter(header => activeColumns[header]);

  const getPlaceholder = (header: string): string => {
    const examples = columnExamples[header];
    if (!examples || examples.length === 0) return `Filtrar por ${header}`;
    
    if (examples.length === 1) {
      return `Exemplo: ${examples[0]}`;
    }
    
    return `Exemplos: ${examples.join(', ')}...`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Analisador de Planilhas Excel</h1>
            <div className="flex gap-4">
              <label className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 transition-colors">
                <Upload size={20} />
                Carregar Planilha
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {headers.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Filtros</h2>
                <div className="flex gap-2">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <X size={16} />
                    Limpar
                  </button>
                  <button
                    onClick={restoreLastFilters}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <RotateCcw size={16} />
                    Restaurar Último
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {headers.map(header => (
                  <div key={header} className="relative bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {header}
                      </label>
                      <button
                        onClick={() => toggleColumn(header)}
                        className={`p-1 rounded-full transition-colors ${
                          activeColumns[header]
                            ? 'text-blue-500 hover:text-blue-600'
                            : 'text-gray-400 hover:text-gray-500'
                        }`}
                        title={activeColumns[header] ? 'Ocultar coluna' : 'Mostrar coluna'}
                      >
                        {activeColumns[header] ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={filters[header]}
                        onChange={(e) => handleFilterChange(header, e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg transition-colors ${
                          activeColumns[header]
                            ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            : 'border-gray-200 bg-gray-100 text-gray-400'
                        }`}
                        placeholder={getPlaceholder(header)}
                        disabled={!activeColumns[header]}
                      />
                      <Search 
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                          activeColumns[header] ? 'text-gray-400' : 'text-gray-300'
                        }`} 
                        size={18} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredData.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    {visibleHeaders.map(header => (
                      <th key={header} className="px-6 py-3">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, index) => (
                    <tr key={index} className="bg-white border-b hover:bg-gray-50">
                      {visibleHeaders.map(header => (
                        <td key={header} className="px-6 py-4 whitespace-nowrap">
                          {row[header]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 text-sm text-gray-600">
                Mostrando {filteredData.length} de {data.length} registros
              </div>
            </div>
          )}

          {headers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Carregue uma planilha Excel para começar a análise</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;