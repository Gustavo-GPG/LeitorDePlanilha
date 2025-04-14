import { Upload } from 'lucide-react';

interface CabecalhoProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Componente de cabeçalho da aplicação
 * @param onFileUpload - Função para processar o upload de arquivos Excel
 */
function Cabecalho({ onFileUpload }: CabecalhoProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold text-white">Analisador de Planilhas Excel</h1>
      <div className="flex gap-4">
        <label className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg cursor-pointer flex items-center gap-2 transition-colors shadow-lg">
          <Upload size={20} />
          Carregar Planilhas (Máx. 10)
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={onFileUpload}
            className="hidden"
            multiple
            max="10"
          />
        </label>
      </div>
    </div>
  );
}

export default Cabecalho;