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
      
      {/* Main content adaptável ao sidebar */}
      <main className="lg:ml-64 pt-16 lg:pt-20 p-4 sm:p-6 lg:p-8 transition-all duration-200">
        {/* Header responsivo */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Gerenciar Visitas</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Agenda de visitas e acompanhamento
            </p>
          </div>
          <Button className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Agendar Visita
          </Button>
        </div>

        {/* Cards de estatísticas responsivos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="shadow-card">
            <CardContent className="p-4 sm:p-6">
              <p className="text-sm text-muted-foreground mb-1">Hoje</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-primary">{todayVisits.length}</h3>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4 sm:p-6">
              <p className="text-sm text-muted-foreground mb-1">Esta Semana</p>
              <h3 className="text-2xl sm:text-3xl font-bold">15</h3>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4 sm:p-6">
              <p className="text-sm text-muted-foreground mb-1">Realizadas</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-secondary">142</h3>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4 sm:p-6">
              <p className="text-sm text-muted-foreground mb-1">Taxa de Conversão</p>
              <h3 className="text-2xl sm:text-3xl font-bold">32%</h3>
            </CardContent>
          </Card>
        </div>

        {/* Próximas Visitas de Hoje */}
        {todayVisits.length > 0 && (
          <Card className="shadow-card mb-6 sm:mb-8">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <CalendarIcon className="h-5 w-5 text-primary" />
                Visitas de Hoje
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="space-y-3">
                {todayVisits.map((visit) => (
                  <div key={visit.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-muted/50 rounded-lg gap-4">
                    <div className="flex items-start sm:items-center gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm sm:text-base">{visit.time} - {visit.client}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{visit.property}</span>
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <User className="h-3 w-3 flex-shrink-0" />
                          Corretor: {visit.broker}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto mt-2 sm:mt-0">
                      Ver Detalhes
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Barra de busca e filtros responsiva */}
        <Card className="shadow-card mb-6 sm:mb-8">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Buscar por cliente, imóvel ou corretor..." 
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <span>Filtros</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de visitas com scroll horizontal */}
        <Card className="shadow-card">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Data/Hora</TableHead>
                    <TableHead className="whitespace-nowrap">Cliente</TableHead>
                    <TableHead className="whitespace-nowrap">Imóvel</TableHead>
                    <TableHead className="whitespace-nowrap">Corretor</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visits.map((visit) => (
                    <TableRow key={visit.id}>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-medium text-sm sm:text-base">{visit.date}</span>
                          <span className="text-xs sm:text-sm text-muted-foreground">{visit.time}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium whitespace-nowrap">{visit.client}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <span className="max-w-[150px] sm:max-w-none truncate block">
                          {visit.property}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{visit.broker}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge 
                          variant={
                            visit.status === "Agendada" ? "default" : 
                            visit.status === "Realizada" ? "secondary" : 
                            "destructive"
                          }
                          className="whitespace-nowrap"
                        >
                          {visit.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" className="whitespace-nowrap">
                          Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Status do Sistema */}
        <div className="p-4 bg-muted rounded-lg mt-6 sm:mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-sm sm:text-base">Sistema de Visitas</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {visits.length} visitas no sistema
              </p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  📅 {todayVisits.length} Hoje
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  ✅ 142 Realizadas
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  📊 32% Conversão
                </Badge>
              </div>
            </div>
            <Button 
              variant="outline"
              size="sm"
              className="gap-2 w-full sm:w-auto"
            >
              <span>Atualizar</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminVisits;
