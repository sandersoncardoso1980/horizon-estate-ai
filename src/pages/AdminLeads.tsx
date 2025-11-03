import AdminSidebar from "@/components/admin/AdminSidebar";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Star, Loader2, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { SupabaseService} from "../../backend/SupabaseService";

interface Lead {
  id: number;
  name: string;
  email: string;
  phone?: string;
  ml_lead_score: number;
  status: string;
  budget_min?: number;
  budget_max?: number;
  preferred_locations?: string;
  property_types?: string;
  created_at?: string;
}

const AdminLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    hotLeads: 0,
    warmLeads: 0,
    coldLeads: 0
  });

  useEffect(() => {
    loadLeadsData();
  }, []);

  const loadLeadsData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Carregando dados dos leads...');
      
      // Carrega leads
      const leadsData = await SupabaseService.getAllLeads();
      
      if (leadsData) {
        console.log('✅ Leads carregados:', leadsData.length);
        setLeads(leadsData);
        
        // Calcula estatísticas localmente
        const hotLeads = leadsData.filter(lead => lead.ml_lead_score >= 80).length;
        const warmLeads = leadsData.filter(lead => lead.ml_lead_score >= 60 && lead.ml_lead_score < 80).length;
        const coldLeads = leadsData.filter(lead => lead.ml_lead_score < 60).length;
        
        setStats({
          hotLeads,
          warmLeads,
          coldLeads
        });
      } else {
        console.log('⚠️ Nenhum lead encontrado, usando dados de exemplo');
        // Fallback para dados de exemplo
        setLeads(getSampleLeads());
        setStats({
          hotLeads: 2,
          warmLeads: 1,
          coldLeads: 1
        });
      }
    } catch (error) {
      console.error('❌ Erro ao carregar dados dos leads:', error);
      // Fallback para dados de exemplo em caso de erro
      setLeads(getSampleLeads());
      setStats({
        hotLeads: 2,
        warmLeads: 1,
        coldLeads: 1
      });
    } finally {
      setLoading(false);
    }
  };

  // Dados de exemplo como fallback
  const getSampleLeads = (): Lead[] => {
    return [
      { 
        id: 1, 
        name: "João Silva", 
        email: "joao@email.com", 
        phone: "(11) 99999-9999", 
        ml_lead_score: 85, 
        status: "qualified",
        budget_min: 800000,
        budget_max: 1200000,
        preferred_locations: "Centro, Zona Sul"
      },
      { 
        id: 2, 
        name: "Maria Santos", 
        email: "maria@email.com", 
        phone: "(11) 98888-8888", 
        ml_lead_score: 72, 
        status: "contacted",
        budget_min: 600000,
        budget_max: 900000,
        preferred_locations: "Zona Leste"
      },
      { 
        id: 3, 
        name: "Pedro Costa", 
        email: "pedro@email.com", 
        phone: "(11) 97777-7777", 
        ml_lead_score: 95, 
        status: "qualified",
        budget_min: 1200000,
        budget_max: 2000000,
        preferred_locations: "Centro"
      },
      { 
        id: 4, 
        name: "Ana Lima", 
        email: "ana@email.com", 
        phone: "(11) 96666-6666", 
        ml_lead_score: 45, 
        status: "new",
        budget_min: 500000,
        budget_max: 700000,
        preferred_locations: "Qualquer"
      },
    ];
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-secondary";
    if (score >= 60) return "text-primary";
    return "text-muted-foreground";
  };

  const getStatusText = (score: number) => {
    if (score >= 80) return "Quente";
    if (score >= 60) return "Morno";
    return "Frio";
  };

  const getStatusColor = (score: number) => {
    if (score >= 80) return "bg-secondary/10 text-secondary";
    if (score >= 60) return "bg-primary/10 text-primary";
    return "bg-muted text-muted-foreground";
  };

  const formatPhone = (phone: string) => {
    return phone || "Não informado";
  };

  const formatBudget = (min?: number, max?: number) => {
    if (min && max) {
      return `R$ ${min.toLocaleString()} - R$ ${max.toLocaleString()}`;
    }
    if (min) {
      return `A partir de R$ ${min.toLocaleString()}`;
    }
    if (max) {
      return `Até R$ ${max.toLocaleString()}`;
    }
    return "Não definido";
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <AdminSidebar />
        <main className="lg:ml-64 pt-16 lg:pt-20 p-4 sm:p-6 lg:p-8 transition-all duration-200">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Carregando leads...</p>
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
      
      {/* Main content adaptável ao sidebar - MESMA ESTRUTURA DO ADMIN CLIENTS */}
      <main className="lg:ml-64 pt-16 lg:pt-20 p-4 sm:p-6 lg:p-8 transition-all duration-200">
        {/* Header responsivo */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Gerenciar Leads</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Acompanhe e qualifique seus leads com IA
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button onClick={loadLeadsData} disabled={loading} variant="outline" className="gap-2 w-full sm:w-auto">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
          </div>
        </div>

        {/* Cards de estatísticas responsivos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="shadow-card">
            <CardContent className="p-4 sm:p-6">
              <p className="text-sm text-muted-foreground mb-1">Leads Quentes</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-secondary">{stats.hotLeads}</h3>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4 sm:p-6">
              <p className="text-sm text-muted-foreground mb-1">Leads Mornos</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-primary">{stats.warmLeads}</h3>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4 sm:p-6">
              <p className="text-sm text-muted-foreground mb-1">Leads Frios</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-muted-foreground">{stats.coldLeads}</h3>
            </CardContent>
          </Card>
        </div>

        {/* Barra de busca e filtros responsiva */}
        <Card className="shadow-card mb-6 sm:mb-8">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Buscar leads por nome ou email..." 
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

        {/* Tabela de leads com scroll horizontal */}
        <Card className="shadow-card">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Nome</TableHead>
                    <TableHead className="whitespace-nowrap">Email</TableHead>
                    <TableHead className="whitespace-nowrap">Telefone</TableHead>
                    <TableHead className="whitespace-nowrap">Orçamento</TableHead>
                    <TableHead className="whitespace-nowrap">Score IA</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                    <TableHead className="whitespace-nowrap">Localização</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {leads.length === 0 ? "Nenhum lead encontrado" : "Nenhum lead corresponde à busca"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLeads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium whitespace-nowrap">{lead.name}</TableCell>
                        <TableCell className="whitespace-nowrap">{lead.email}</TableCell>
                        <TableCell className="whitespace-nowrap">{formatPhone(lead.phone || "")}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          {formatBudget(lead.budget_min, lead.budget_max)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Star className={`h-4 w-4 ${getScoreColor(lead.ml_lead_score)}`} />
                            <span className={`font-semibold ${getScoreColor(lead.ml_lead_score)}`}>
                              {lead.ml_lead_score}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(lead.ml_lead_score)}`}>
                            {getStatusText(lead.ml_lead_score)}
                          </span>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {lead.preferred_locations || "Não especificado"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Status do Sistema - igual ao AdminClients */}
        <div className="p-4 bg-muted rounded-lg mt-6 sm:mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-sm sm:text-base">Sistema de Leads</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {leads.length} leads no sistema
              </p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <span className="px-2 py-1 rounded-full text-xs bg-secondary/10 text-secondary whitespace-nowrap">
                  🔥 {stats.hotLeads} Quentes
                </span>
                <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary whitespace-nowrap">
                  🌤️ {stats.warmLeads} Mornos
                </span>
                <span className="px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground whitespace-nowrap">
                  ❄️ {stats.coldLeads} Frios
                </span>
              </div>
            </div>
            <Button 
              onClick={loadLeadsData}
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

export default AdminLeads;
