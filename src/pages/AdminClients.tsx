import AdminSidebar from "@/components/admin/AdminSidebar";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Eye, Edit, Trash2, Phone, Mail } from "lucide-react";
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

const AdminClients = () => {
  const clients = [
    { 
      id: 1, 
      name: "João Silva", 
      email: "joao@email.com", 
      phone: "(11) 99999-9999", 
      cpf: "123.456.789-00",
      properties: 2,
      status: "Ativo",
      lastContact: "12/01/2024"
    },
    { 
      id: 2, 
      name: "Maria Santos", 
      email: "maria@email.com", 
      phone: "(11) 98888-8888", 
      cpf: "234.567.890-11",
      properties: 1,
      status: "Ativo",
      lastContact: "10/01/2024"
    },
    { 
      id: 3, 
      name: "Pedro Costa", 
      email: "pedro@email.com", 
      phone: "(11) 97777-7777", 
      cpf: "345.678.901-22",
      properties: 3,
      status: "Ativo",
      lastContact: "08/01/2024"
    },
    { 
      id: 4, 
      name: "Ana Lima", 
      email: "ana@email.com", 
      phone: "(11) 96666-6666", 
      cpf: "456.789.012-33",
      properties: 0,
      status: "Inativo",
      lastContact: "20/12/2023"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AdminSidebar />
      
      <main className="ml-64 pt-20 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gerenciar Clientes</h1>
            <p className="text-muted-foreground">Cadastro e acompanhamento de clientes</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Cliente
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Total de Clientes</p>
              <h3 className="text-3xl font-bold">87</h3>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Clientes Ativos</p>
              <h3 className="text-3xl font-bold text-secondary">73</h3>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Novos Este Mês</p>
              <h3 className="text-3xl font-bold text-primary">12</h3>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Proprietários</p>
              <h3 className="text-3xl font-bold">54</h3>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar por nome, email, CPF ou telefone..." className="pl-10" />
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
                  <TableHead>Nome</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Imóveis</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Último Contato</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {client.email}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {client.phone}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{client.cpf}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{client.properties} imóveis</Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        client.status === "Ativo" 
                          ? "bg-secondary/10 text-secondary" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {client.status}
                      </span>
                    </TableCell>
                    <TableCell>{client.lastContact}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" title="Ver detalhes">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" title="Editar">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" title="Excluir">
                          <Trash2 className="h-4 w-4" />
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

export default AdminClients;
