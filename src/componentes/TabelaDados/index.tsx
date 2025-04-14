import { FileSpreadsheet } from 'lucide-react';

interface TabelaDadosProps {
  filteredData: any[];
  visibleHeaders: string[];
  allData: { fileName: string; data: any[] }[];
}

/**
 * Componente que renderiza a tabela de dados
 * @param props - Propriedades do componente incluindo dados filtrados e cabeçalhos visíveis
 */
function TabelaDados({ filteredData, visibleHeaders, allData }: TabelaDadosProps) {
  return (
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
  );
}

export default TabelaDados;