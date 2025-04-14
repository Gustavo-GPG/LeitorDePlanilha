import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement,
  Title
} from 'chart.js';

// Importação dos componentes
import Cabecalho from './componentes/Cabecalho';
import BotoesVisualizacao from './componentes/BotoesVisualizacao';
import ConfiguracoesGrafico from './componentes/ConfiguracoesGrafico';
import Filtros from './componentes/Filtros';
import TabelaDados from './componentes/TabelaDados';
import Graficos from './componentes/Graficos';
import { processChartData } from './utils/processamento';

// Registro dos componentes do Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

// Interfaces
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

type ViewMode = 'table' | 'pie' | 'doughnut' | 'bar' | 'stacked-bar' | 'horizontal-bar';

/**
 * Componente principal da aplicação
 */
function App() {
  // Estados
  const [headers, setHeaders] = useState<string[]>([]);
  const [allData, setAllData] = useState<FileData[]>([]);
  const [filters, setFilters] = useState<FilterState>({});
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [activeColumns, setActiveColumns] = useState<ColumnVisibility>({});
  const [columnOptions, setColumnOptions] = useState<ColumnExamples>({});
  const [hiddenFilters, setHiddenFilters] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [chartColumn, setChartColumn] = useState<string>('');
  const [aggregateColumn, setAggregateColumn] = useState<string>('');
  const [secondaryChartColumn, setSecondaryChartColumn] = useState<string>('');

  /**
   * Obtém valores únicos de uma coluna
   */
  const getUniqueValues = (data: any[], header: string): string[] => {
    const uniqueSet = new Set(
      data.map(row => String(row[header]))
        .filter(value => value !== undefined && value !== null && value !== '')
    );
    return Array.from(uniqueSet).sort();
  };

  /**
   * Processa arquivo Excel
   */
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

  /**
   * Manipula o upload de arquivos
   */
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

  /**
   * Manipula mudanças nos filtros
   */
  const handleFilterChange = (header: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [header]: value
    }));
  };

  /**
   * Alterna visibilidade das colunas
   */
  const toggleColumn = (header: string) => {
    setActiveColumns(prev => ({
      ...prev,
      [header]: !prev[header]
    }));
  };

  /**
   * Alterna visibilidade dos filtros
   */
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

  /**
   * Limpa todos os filtros
   */
  const clearFilters = () => {
    const clearedFilters: FilterState = {};
    headers.forEach(header => {
      clearedFilters[header] = '';
    });
    setFilters(clearedFilters);
  };

  /**
   * Aplica os filtros aos dados
   */
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

  // Efeito para aplicar filtros quando necessário
  useEffect(() => {
    applyFilters();
  }, [filters, activeColumns, allData]);

  const visibleHeaders = headers.filter(header => activeColumns[header]);
  const chartData = processChartData(filteredData, chartColumn, aggregateColumn, secondaryChartColumn, viewMode);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800 rounded-xl shadow-2xl p-6 mb-8 border border-gray-700">
          <Cabecalho onFileUpload={handleFileUpload} />

          {headers.length > 0 && (
            <>
              <BotoesVisualizacao viewMode={viewMode} setViewMode={setViewMode} />

              {viewMode !== 'table' && (
                <ConfiguracoesGrafico
                  headers={headers}
                  chartColumn={chartColumn}
                  setChartColumn={setChartColumn}
                  secondaryChartColumn={secondaryChartColumn}
                  setSecondaryChartColumn={setSecondaryChartColumn}
                  aggregateColumn={aggregateColumn}
                  setAggregateColumn={setAggregateColumn}
                  viewMode={viewMode}
                />
              )}

              <Filtros
                headers={headers}
                filters={filters}
                activeColumns={activeColumns}
                columnOptions={columnOptions}
                hiddenFilters={hiddenFilters}
                handleFilterChange={handleFilterChange}
                toggleColumn={toggleColumn}
                toggleFilterVisibility={toggleFilterVisibility}
                clearFilters={clearFilters}
                setHiddenFilters={setHiddenFilters}
              />

              {viewMode === 'table' ? (
                <TabelaDados
                  filteredData={filteredData}
                  visibleHeaders={visibleHeaders}
                  allData={allData}
                />
              ) : (
                <div className="bg-gray-700 p-6 rounded-lg">
                  {chartColumn && aggregateColumn ? (
                    <div className="aspect-[16/9] w-full">
                      <Graficos
                        viewMode={viewMode}
                        chartData={chartData}
                        chartColumn={chartColumn}
                        aggregateColumn={aggregateColumn}
                      />
                    </div>
                  ) : (
                    <p className="text-center text-gray-400">
                      Selecione as colunas para visualizar o gráfico
                    </p>
                  )}
                </div>
              )}
            </>
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