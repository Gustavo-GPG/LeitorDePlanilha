import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Upload, Search, X, Eye, EyeOff, FileSpreadsheet, Trash2 } from 'lucide-react';

interface FilterState {
  [key: string]: string;
}

interface ColumnVisibility {
  [key: string]: boolean;
}

interface ColumnExamples {
  [key: string]: string[];
}

interface FileData {
  fileName: string;
  data: any[];
}

function App() {
  const [headers, setHeaders] = useState<string[]>([]);
  const [allData, setAllData] = useState<FileData[]>([]);
  const [filters, setFilters] = useState<FilterState>({});
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [activeColumns, setActiveColumns] = useState<ColumnVisibility>({});
  const [columnOptions, setColumnOptions] = useState<ColumnExamples>({});
  const [hiddenFilters, setHiddenFilters] = useState<Set<string>>(new Set());

  const getUniqueValues = (data: any[], header: string): string[] => {
    const uniqueSet = new Set(
      data.map(row => String(row[header]))
        .filter(value => value !== undefined && value !== null && value !== '')
    );
    return Array.from(uniqueSet).sort();
  };

  const processExcelFile = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const fileArray = Array.from(files).slice(0, 10);
    const newDataArray: FileData[] = [];

    try {
      for (const file of fileArray) {
        const jsonData = await processExcelFile(file);
        if (jsonData.length > 0) {
          newDataArray.push({
            fileName: file.name,
            data: jsonData
          });
        }
      }

      const allHeaders = new Set<string>();
      const allOptions: ColumnExamples = {};

      newDataArray.forEach(fileData => {
        fileData.data.forEach(row => {
          Object.keys(row).forEach(header => {
            allHeaders.add(header);
            if (!allOptions[header]) {
              allOptions[header] = [];
            }
          });
        });
      });

      // Coletar todas as opções únicas para cada coluna
      newDataArray.forEach(fileData => {
        Array.from(allHeaders).forEach(header => {
          const headerOptions = getUniqueValues(fileData.data, header);
          allOptions[header] = Array.from(new Set([...allOptions[header], ...headerOptions]));
        });
      });

      const headerArray = Array.from(allHeaders);
      setHeaders(headerArray);
      setHiddenFilters(new Set());

      const initialFilters: FilterState = {};
      const initialVisibility: ColumnVisibility = {};

      headerArray.forEach(header => {
        initialFilters[header] = '';
        initialVisibility[header] = true;
      });

      setAllData(newDataArray);
      setFilters(initialFilters);
      setActiveColumns(initialVisibility);
      setColumnOptions(allOptions);
    } catch (error) {
      console.error('Erro ao processar arquivos:', error);
    }
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

  const toggleFilterVisibility = (header: string) => {
    setHiddenFilters(prev => {
      const newHidden = new Set(prev);
      if (newHidden.has(header)) {
        newHidden.delete(header);
      } else {
        newHidden.add(header);
      }
      return newHidden;
    });
  };

  const applyFilters = () => {
    const allFilteredData = allData.flatMap(fileData => {
      return fileData.data.filter(row => {
        return Object.entries(filters).every(([header, filterValue]) => {
          if (!activeColumns[header] || !filterValue) return true;
          const cellValue = String(row[header] || '').toLowerCase();
          return cellValue === filterValue.toLowerCase();
        });
      }).map(row => ({
        ...row,
        _sourceFile: fileData.fileName
      }));
    });

    setFilteredData(allFilteredData);
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {};
    headers.forEach(header => {
      clearedFilters[header] = '';
    });
    setFilters(clearedFilters);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, activeColumns, allData]);

  const visibleHeaders = headers.filter(header => activeColumns[header]);
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
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800 rounded-xl shadow-2xl p-6 mb-8 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white">Analisador de Planilhas Excel</h1>
            <div className="flex gap-4">
              <label className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg cursor-pointer flex items-center gap-2 transition-colors shadow-lg">
                <Upload size={20} />
                Carregar Planilhas (Máx. 10)
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                  multiple
                  max="10"
                />
              </label>
            </div>
          </div>

          {headers.length > 0 && (
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
          )}

          {filteredData.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-gray-700">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-gray-200">Arquivo Fonte</th>
                    {visibleHeaders.map(header => (
                      <th key={header} className="px-6 py-3 text-gray-200">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, index) => (
                    <tr key={index} className="bg-indigo-900/20 border-b border-gray-700 hover:bg-indigo-900/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2 text-indigo-200">
                        <FileSpreadsheet size={16} className="text-indigo-400" />
                        {row._sourceFile}
                      </td>
                      {visibleHeaders.map(header => (
                        <td key={header} className="px-6 py-4 whitespace-nowrap text-indigo-100">
                          {row[header]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-gray-800 px-6 py-4 text-sm text-gray-400 border-t border-gray-700">
                Mostrando {filteredData.length} de {allData.reduce((sum, fileData) => sum + fileData.data.length, 0)} registros
                de {allData.length} {allData.length === 1 ? 'planilha' : 'planilhas'}
              </div>
            </div>
          )}

          {headers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">Carregue uma ou mais planilhas Excel para começar a análise</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;