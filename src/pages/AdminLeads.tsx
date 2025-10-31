import AdminSidebar from "@/components/admin/AdminSidebar";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminLeads = () => {
  const leads = [
    { id: 1, name: "João Silva", email: "joao@email.com", phone: "(11) 99999-9999", score: 85, status: "Quente", property: "AP001" },
    { id: 2, name: "Maria Santos", email: "maria@email.com", phone: "(11) 98888-8888", score: 72, status: "Morno", property: "CS002" },
    { id: 3, name: "Pedro Costa", email: "pedro@email.com", phone: "(11) 97777-7777", score: 95, status: "Quente", property: "LF003" },
    { id: 4, name: "Ana Lima", email: "ana@email.com", phone: "(11) 96666-6666", score: 45, status: "Frio", property: "AP004" },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-secondary";
    if (score >= 60) return "text-primary";
    return "text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AdminSidebar />
      
      <main className="ml-64 pt-20 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Gerenciar Leads</h1>
          <p className="text-muted-foreground">Acompanhe e qualifique seus leads com IA</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Leads Quentes</p>
              <h3 className="text-3xl font-bold text-secondary">18</h3>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Leads Mornos</p>
              <h3 className="text-3xl font-bold text-primary">15</h3>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Leads Frios</p>
              <h3 className="text-3xl font-bold text-muted-foreground">10</h3>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar leads..." className="pl-10" />
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
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Score IA</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Imóvel</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>{lead.phone}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Star className={`h-4 w-4 ${getScoreColor(lead.score)}`} />
                        <span className={`font-semibold ${getScoreColor(lead.score)}`}>
                          {lead.score}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        lead.status === "Quente" 
                          ? "bg-secondary/10 text-secondary" 
                          : lead.status === "Morno"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {lead.status}
                      </span>
                    </TableCell>
                    <TableCell>{lead.property}</TableCell>
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

export default AdminLeads;
