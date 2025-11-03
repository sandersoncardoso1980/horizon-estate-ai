import AdminSidebar from "@/components/admin/AdminSidebar";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, FileText, Download, Eye, RefreshCw, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { supabase } from "../../backend/SupabaseService";

interface Contract {
  id: number;
  code: string;
  client: string;
  property: string;
  value: string;
  type: "Venda" | "Locação";
  status: "Assinado" | "Em Análise" | "Pendente";
  date: string;
}

const AdminContracts = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Buscar contratos do Supabase
  const fetchContracts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setContracts(data || []);
    } catch (error) {
      console.error('Erro ao buscar contratos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  // Filtrar contratos baseado na busca
  const filteredContracts = contracts.filter(contract =>
    contract.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.property.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Estatísticas calculadas dinamicamente
  const totalContracts = contracts.length;
  const signedContracts = contracts.filter(c => c.status === "Assinado").length;
  const analysisContracts = contracts.filter(c => c.status === "Em Análise").length;
  const pendingContracts = contracts.filter(c => c.status === "Pendente").length;

  // Função para baixar contrato
  const handleDownload = async (contractId: number, contractCode: string) => {
    try {
      // Aqui você pode implementar a lógica para gerar/download do PDF
      console.log(`Baixando contrato: ${contractCode}`);
      
      // Exemplo de como buscar arquivo do Supabase Storage se necessário
      // const { data, error } = await supabase.storage
      //   .from('contracts')
      //   .download(`${contractCode}.pdf`);
      
      alert(`Download do contrato ${contractCode} iniciado!`);
    } catch (error) {
      console.error('Erro ao baixar contrato:', error);
      alert('Erro ao baixar contrato');
    }
  };

  // Função para visualizar contrato
  const handleView = (contractId: number) => {
    // Navegar para página de detalhes ou abrir modal
    console.log(`Visualizando contrato ID: ${contractId}`);
    // router.push(`/admin/contracts/${contractId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <AdminSidebar />
        <main className="lg:ml-64 pt-16 lg:pt-20 p-4 sm:p-6 lg:p-8 transition-all duration-200">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Carregando contratos...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AdminSidebar />
      
      {/* Main content adaptável ao sidebar */}
      <main className="lg:ml-64 pt-16 lg:pt-20 p-4 sm:p-6 lg:p-8 transition-all duration-200">
        {/* Header responsivo */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Gerenciar Contratos</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Contratos de venda e locação
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button onClick={fetchContracts} disabled={loading} variant="outline" className="gap-2 w-full sm:w-auto">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
            <Button className="gap-2 w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              Novo Contrato
            </Button>
          </div>
        </div>

        {/* Cards de Estatísticas Responsivos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="shadow-card">
            <CardContent className="p-4 sm:p-6">
              <p className="text-sm text-muted-foreground mb-1">Total de Contratos</p>
              <h3 className="text-2xl sm:text-3xl font-bold">{totalContracts}</h3>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4 sm:p-6">
              <p className="text-sm text-muted-foreground mb-1">Assinados</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-secondary">{signedContracts}</h3>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4 sm:p-6">
              <p className="text-sm text-muted-foreground mb-1">Em Análise</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-primary">{analysisContracts}</h3>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4 sm:p-6">
              <p className="text-sm text-muted-foreground mb-1">Pendentes</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-muted-foreground">{pendingContracts}</h3>
            </CardContent>
          </Card>
        </div>

        {/* Busca e Filtros Responsivos */}
        <Card className="shadow-card mb-6 sm:mb-8">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Buscar por código, cliente ou imóvel..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <span>Filtros</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Contratos com Scroll Horizontal */}
        <Card className="shadow-card">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Código</TableHead>
                    <TableHead className="whitespace-nowrap">Cliente</TableHead>
                    <TableHead className="whitespace-nowrap">Imóvel</TableHead>
                    <TableHead className="whitespace-nowrap">Valor</TableHead>
                    <TableHead className="whitespace-nowrap">Tipo</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                    <TableHead className="whitespace-nowrap">Data</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContracts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        {contracts.length === 0 ? "Nenhum contrato encontrado" : "Nenhum contrato corresponde à busca"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredContracts.map((contract) => (
                      <TableRow key={contract.id}>
                        <TableCell className="font-medium whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="truncate">{contract.code}</span>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <span className="truncate block max-w-[120px] sm:max-w-none">
                            {contract.client}
                          </span>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <span className="truncate block max-w-[120px] sm:max-w-none">
                            {contract.property}
                          </span>
                        </TableCell>
                        <TableCell className="font-semibold whitespace-nowrap">{contract.value}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge variant="outline" className="whitespace-nowrap">
                            {contract.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge 
                            variant={
                              contract.status === "Assinado" ? "secondary" : 
                              contract.status === "Em Análise" ? "default" : 
                              "outline"
                            }
                            className="whitespace-nowrap"
                          >
                            {contract.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{contract.date}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1 sm:gap-2">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              title="Visualizar"
                              onClick={() => handleView(contract.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              title="Baixar"
                              onClick={() => handleDownload(contract.id, contract.code)}
                              className="h-8 w-8 p-0"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Status do Sistema */}
        <div className="p-4 bg-muted rounded-lg mt-6 sm:mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-sm sm:text-base">Sistema de Contratos</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {contracts.length} contratos no sistema
              </p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  📄 {totalContracts} Total
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  ✅ {signedContracts} Assinados
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  ⏳ {analysisContracts} Em Análise
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  📋 {pendingContracts} Pendentes
                </Badge>
              </div>
            </div>
            <Button 
              onClick={fetchContracts}
              variant="outline"
              size="sm"
              className="gap-2 w-full sm:w-auto"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Atualizar</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminContracts;
