import AdminSidebar from "@/components/admin/AdminSidebar";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Calendar as CalendarIcon, Clock, MapPin, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminVisits = () => {
  const visits = [
    { 
      id: 1, 
      client: "João Silva", 
      property: "AP001 - Apartamento Centro",
      date: "15/01/2024",
      time: "14:00",
      status: "Agendada",
      broker: "Carlos Mendes"
    },
    { 
      id: 2, 
      client: "Maria Santos", 
      property: "CS002 - Casa Alphaville",
      date: "15/01/2024",
      time: "16:00",
      status: "Agendada",
      broker: "Ana Paula"
    },
    { 
      id: 3, 
      client: "Pedro Costa", 
      property: "LF003 - Loft Vila Madalena",
      date: "14/01/2024",
      time: "10:00",
      status: "Realizada",
      broker: "Carlos Mendes"
    },
    { 
      id: 4, 
      client: "Ana Lima", 
      property: "AP004 - Cobertura Duplex",
      date: "13/01/2024",
      time: "15:00",
      status: "Cancelada",
      broker: "Ana Paula"
    },
  ];

  const todayVisits = visits.filter(v => v.date === "15/01/2024" && v.status === "Agendada");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AdminSidebar />
      
      <main className="ml-64 pt-20 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gerenciar Visitas</h1>
            <p className="text-muted-foreground">Agenda de visitas e acompanhamento</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Agendar Visita
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Hoje</p>
              <h3 className="text-3xl font-bold text-primary">{todayVisits.length}</h3>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Esta Semana</p>
              <h3 className="text-3xl font-bold">15</h3>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Realizadas</p>
              <h3 className="text-3xl font-bold text-secondary">142</h3>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Taxa de Conversão</p>
              <h3 className="text-3xl font-bold">32%</h3>
            </CardContent>
          </Card>
        </div>

        {/* Próximas Visitas de Hoje */}
        {todayVisits.length > 0 && (
          <Card className="shadow-card mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                Visitas de Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayVisits.map((visit) => (
                  <div key={visit.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{visit.time} - {visit.client}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {visit.property}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <User className="h-3 w-3" />
                          Corretor: {visit.broker}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Ver Detalhes</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-card mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar por cliente, imóvel ou corretor..." className="pl-10" />
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
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Imóvel</TableHead>
                  <TableHead>Corretor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visits.map((visit) => (
                  <TableRow key={visit.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{visit.date}</span>
                        <span className="text-sm text-muted-foreground">{visit.time}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{visit.client}</TableCell>
                    <TableCell>{visit.property}</TableCell>
                    <TableCell>{visit.broker}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          visit.status === "Agendada" ? "default" : 
                          visit.status === "Realizada" ? "secondary" : 
                          "destructive"
                        }
                      >
                        {visit.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline">Detalhes</Button>
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

export default AdminVisits;
