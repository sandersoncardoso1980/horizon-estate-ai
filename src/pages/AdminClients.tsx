import AdminSidebar from "@/components/admin/AdminSidebar";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Eye, Edit, Trash2, Phone, Mail, Loader2, RefreshCw, Database } from "lucide-react";
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
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../SupabaseService";

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  status: string;
  is_owner?: boolean;
  created_at: string;
  last_contact?: string;
  properties_count?: number;
}

const AdminClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    newThisMonth: 0,
    owners: 0
  });
  const [needsSetup, setNeedsSetup] = useState(false);
  const [dataSource, setDataSource] = useState<'supabase' | 'mock'>('supabase');

  // Dados de exemplo como fallback
  const getSampleClients = (): Client[] => {
    return [
      { 
        id: 1, 
        name: "João Silva", 
        email: "joao@email.com", 
        phone: "(11) 99999-9999", 
        cpf: "123.456.789-00",
        status: "active",
        is_owner: true,
        created_at: "2024-01-01",
        last_contact: "2024-01-12",
        properties_count: 2
      },
      { 
        id: 2, 
        name: "Maria Santos", 
        email: "maria@email.com", 
        phone: "(11) 98888-8888", 
        cpf: "234.567.890-11",
        status: "active",
        is_owner: true,
        created_at: "2024-01-05",
        last_contact: "2024-01-10",
        properties_count: 1
      },
      { 
        id: 3, 
        name: "Pedro Costa", 
        email: "pedro@email.com", 
        phone: "(11) 97777-7777", 
        cpf: "345.678.901-22",
        status: "active",
        is_owner: false,
        created_at: "2024-01-08",
        last_contact: "2024-01-08",
        properties_count: 0
      },
      { 
        id: 4, 
        name: "Ana Lima", 
        email: "ana@email.com", 
        phone: "(11) 96666-6666", 
        cpf: "456.789.012-33",
        status: "inactive",
        is_owner: false,
        created_at: "2023-12-15",
        last_contact: "2023-12-20",
        properties_count: 0
      },
    ];
  };

  // 🔄 BUSCA DIRETA DO SUPABASE - igual ao AdminProperties
  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 Buscando clientes no Supabase...');

      let query = supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      // Busca full-text como no AdminProperties
      if (searchTerm.trim()) {
        const term = searchTerm.trim();
        query = query.or(`
          name.ilike.%${term}%,
          email.ilike.%${term}%,
          phone.ilike.%${term}%,
          cpf.ilike.%${term}%
        `);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Erro ao buscar clientes:', error);
        
        // Se a tabela não existir
        if (error.code === '42P01') {
          console.log('📋 Tabela "clients" não existe');
          setNeedsSetup(true);
          setDataSource('mock');
          setClients(getSampleClients());
          setStats({
            totalClients: 4,
            activeClients: 3,
            newThisMonth: 2,
            owners: 2
          });
          return;
        }
        
        setNeedsSetup(true);
        setDataSource('mock');
        setClients(getSampleClients());
        setStats({
          totalClients: 4,
          activeClients: 3,
          newThisMonth: 2,
          owners: 2
        });
        return;
      }

      console.log(`✅ ${data?.length || 0} clientes encontrados`);
      
      if (data && data.length > 0) {
        setClients(data);
        setDataSource('supabase');
        setNeedsSetup(false);
        
        // Calcular estatísticas
        const activeClients = data.filter(client => client.status === 'active').length;
        const newThisMonth = data.filter(client => {
          const created = new Date(client.created_at);
          const now = new Date();
          return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
        }).length;
        const owners = data.filter(client => client.is_owner).length;

        setStats({
          totalClients: data.length,
          activeClients,
          newThisMonth,
          owners
        });
      } else {
        // Tabela existe mas está vazia
        setNeedsSetup(true);
        setDataSource('mock');
        setClients(getSampleClients());
        setStats({
          totalClients: 4,
          activeClients: 3,
          newThisMonth: 2,
          owners: 2
        });
      }
    } catch (error) {
      console.error('❌ Erro inesperado:', error);
      setNeedsSetup(true);
      setDataSource('mock');
      setClients(getSampleClients());
      setStats({
        totalClients: 4,
        activeClients: 3,
        newThisMonth: 2,
        owners: 2
      });
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  // Debounce na busca - igual ao AdminProperties
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchClients();
    }, 400);

    return () => clearTimeout(timer);
  }, [fetchClients]);

  // 🌱 POPULAR DADOS DIRETAMENTE - igual ao AdminProperties
  const populateClientsData = async () => {
    try {
      setLoading(true);
      console.log('🌱 Populando dados de clientes...');

      const clientsData = [
        { 
          name: 'João Silva', 
          email: 'joao.silva@email.com', 
          phone: '(11) 99999-9999', 
          cpf: '123.456.789-00',
          status: 'active',
          is_owner: true,
          last_contact: '2024-01-12 10:30:00'
        },
        { 
          name: 'Maria Santos', 
          email: 'maria.santos@email.com', 
          phone: '(11) 98888-8888', 
          cpf: '234.567.890-11',
          status: 'active',
          is_owner: true,
          last_contact: '2024-01-10 14:20:00'
        },
        { 
          name: 'Pedro Costa', 
          email: 'pedro.costa@email.com', 
          phone: '(11) 97777-7777', 
          cpf: '345.678.901-22',
          status: 'active',
          is_owner: false,
          last_contact: '2024-01-08 09:15:00'
        }
      ];

      const { error } = await supabase
        .from('clients')
        .insert(clientsData);

      if (error) {
        console.error('❌ Erro ao inserir clientes:', error);
        alert(`Erro: ${error.message}`);
        return;
      }

      console.log(`✅ ${clientsData.length} clientes inseridos com sucesso`);
      alert('Dados populados com sucesso!');
      setNeedsSetup(false);
      
      // Recarregar os dados
      await fetchClients();
    } catch (error) {
      console.error('❌ Erro ao popular dados:', error);
      alert('Erro ao popular dados');
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ DELETAR CLIENTE - igual ao AdminProperties
  const handleDeleteClient = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return;

    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;

      console.log('✅ Cliente deletado');
      await fetchClients(); // Recarregar a lista
    } catch (error) {
      console.error('❌ Erro ao deletar cliente:', error);
      alert('Erro ao deletar cliente');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Nunca";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return "Data inválida";
    }
  };

  const formatStatus = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'active': 'Ativo',
      'inactive': 'Inativo',
      'pending': 'Pendente',
      'blocked': 'Bloqueado'
    };
    
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    if (status === 'active') return "bg-secondary/10 text-secondary";
    return "bg-muted text-muted-foreground";
  };

  const getDataSourceBadge = () => {
    const badges = {
      'supabase': { label: 'Dados Reais', color: 'bg-green-100 text-green-800' },
      'mock': { label: 'Dados Exemplo', color: 'bg-yellow-100 text-yellow-800' }
    };
    
    const badge = badges[dataSource];
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.cpf && client.cpf.includes(searchTerm)) ||
    (client.phone && client.phone.includes(searchTerm))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <AdminSidebar />
        <main className="ml-64 pt-20 p-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Carregando clientes...</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AdminSidebar />
      
      <main className="ml-64 pt-20 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold mb-2">Gerenciar Clientes</h1>
              {getDataSourceBadge()}
            </div>
            <p className="text-muted-foreground">Cadastro e acompanhamento de clientes</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchClients} disabled={loading} variant="outline">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            {needsSetup && (
              <Button onClick={populateClientsData} disabled={loading} variant="secondary" className="gap-2">
                <Database className="h-4 w-4" />
                Popular Dados
              </Button>
            )}
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Cliente
            </Button>
          </div>
        </div>

        {needsSetup && (
          <div className="mb-6 p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800">
              <Database className="h-5 w-5" />
              <h3 className="font-semibold">Base de Dados Não Configurada</h3>
            </div>
            <p className="text-yellow-700 text-sm mt-1">
              {dataSource === 'mock' 
                ? 'A tabela de clientes não existe ou está vazia. Clique em "Popular Dados" para criar a tabela e adicionar dados de exemplo.'
                : 'Não foi possível conectar com o banco de dados.'
              }
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Total de Clientes</p>
              <h3 className="text-3xl font-bold">{stats.totalClients}</h3>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Clientes Ativos</p>
              <h3 className="text-3xl font-bold text-secondary">{stats.activeClients}</h3>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Novos Este Mês</p>
              <h3 className="text-3xl font-bold text-primary">{stats.newThisMonth}</h3>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Proprietários</p>
              <h3 className="text-3xl font-bold">{stats.owners}</h3>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por nome, email, CPF ou telefone..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
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
                {filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {clients.length === 0 ? "Nenhum cliente encontrado" : "Nenhum cliente corresponde à busca"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClients.map((client) => (
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
                        <Badge variant="outline">
                          {client.properties_count || 0} imóvel{client.properties_count !== 1 ? 's' : ''}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(client.status)}`}>
                          {formatStatus(client.status)}
                        </span>
                      </TableCell>
                      <TableCell>{formatDate(client.last_contact || '')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" title="Ver detalhes">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" title="Editar">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            title="Excluir"
                            onClick={() => handleDeleteClient(client.id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
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

export default AdminClients;