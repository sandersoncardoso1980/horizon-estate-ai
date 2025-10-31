import AdminSidebar from "@/components/admin/AdminSidebar";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, FileText, Download, Eye } from "lucide-react";
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
import { supabase } from "../SupabaseService";

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AdminSidebar />
      
      <main className="ml-64 pt-20 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gerenciar Contratos</h1>
            <p className="text-muted-foreground">Contratos de venda e locação</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Contrato
          </Button>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Total de Contratos</p>
              <h3 className="text-3xl font-bold">{totalContracts}</h3>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Assinados</p>
              <h3 className="text-3xl font-bold text-secondary">{signedContracts}</h3>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Em Análise</p>
              <h3 className="text-3xl font-bold text-primary">{analysisContracts}</h3>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Pendentes</p>
              <h3 className="text-3xl font-bold text-muted-foreground">{pendingContracts}</h3>
            </CardContent>
          </Card>
        </div>

        {/* Busca e Filtros */}
        <Card className="shadow-card mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por código, cliente ou imóvel..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline">Filtros</Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Contratos */}
        <Card className="shadow-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Imóvel</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Carregando contratos...
                    </TableCell>
                  </TableRow>
                ) : filteredContracts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Nenhum contrato encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredContracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          {contract.code}
                        </div>
                      </TableCell>
                      <TableCell>{contract.client}</TableCell>
                      <TableCell>{contract.property}</TableCell>
                      <TableCell className="font-semibold">{contract.value}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{contract.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            contract.status === "Assinado" ? "secondary" : 
                            contract.status === "Em Análise" ? "default" : 
                            "outline"
                          }
                        >
                          {contract.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{contract.date}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            title="Visualizar"
                            onClick={() => handleView(contract.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            title="Baixar"
                            onClick={() => handleDownload(contract.id, contract.code)}
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
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminContracts;