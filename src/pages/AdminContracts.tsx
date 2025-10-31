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

const AdminContracts = () => {
  const contracts = [
    { 
      id: 1, 
      code: "CT-2024-001",
      client: "João Silva", 
      property: "AP001 - Apartamento Centro",
      value: "R$ 850.000",
      type: "Venda",
      status: "Assinado",
      date: "10/01/2024"
    },
    { 
      id: 2, 
      code: "CT-2024-002",
      client: "Maria Santos", 
      property: "CS002 - Casa Alphaville",
      value: "R$ 1.950.000",
      type: "Venda",
      status: "Em Análise",
      date: "12/01/2024"
    },
    { 
      id: 3, 
      code: "CT-2024-003",
      client: "Pedro Costa", 
      property: "LF003 - Loft Vila Madalena",
      value: "R$ 680.000",
      type: "Venda",
      status: "Assinado",
      date: "08/01/2024"
    },
    { 
      id: 4, 
      code: "CT-2024-004",
      client: "Ana Lima", 
      property: "AP004 - Cobertura Duplex",
      value: "R$ 3.500/mês",
      type: "Locação",
      status: "Pendente",
      date: "14/01/2024"
    },
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Total de Contratos</p>
              <h3 className="text-3xl font-bold">156</h3>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Assinados</p>
              <h3 className="text-3xl font-bold text-secondary">98</h3>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Em Análise</p>
              <h3 className="text-3xl font-bold text-primary">32</h3>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Pendentes</p>
              <h3 className="text-3xl font-bold text-muted-foreground">26</h3>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar por código, cliente ou imóvel..." className="pl-10" />
              </div>
              <Button variant="outline">Filtros</Button>
            </div>
          </CardContent>
        </Card>

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
                {contracts.map((contract) => (
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
                        <Button size="sm" variant="ghost" title="Visualizar">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" title="Baixar">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminContracts;
