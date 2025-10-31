import AdminSidebar from "@/components/admin/AdminSidebar";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Edit, Trash2, Plus, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../backend/app/services/SupabaseService";

interface Property {
  id: string;
  code: string | null;
  title: string | null;
  type: string;
  price: number | null;
  size: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  status: 'available' | 'sold' | 'pending';
  address: string | null;
  features: string[] | null;
  created_at: string;
}

const AdminProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "apartment",
    price: "",
    size: "",
    bedrooms: "2",
    bathrooms: "1",
    neighborhood: "",
    city: "São Paulo",
    state: "SP"
  });
  const [addingProperty, setAddingProperty] = useState(false);

  // Busca com debounce e filtros
 const fetchProperties = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);

    let query = supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    // Filtro por status
    if (filterStatus !== 'all') {
      query = query.eq('status', filterStatus);
    }

    // BUSCA FULL-TEXT
    if (searchTerm.trim()) {
      const term = searchTerm.trim();

      // 1. Campos normais com OR
      query = query.or(`
        title.ilike.%${term}%,
        code.ilike.%${term}%,
        type.ilike.%${term}%,
        status.ilike.%${term}%,
        address->>city.ilike.%${term}%,
        address->>state.ilike.%${term}%,
        address->>neighborhood.ilike.%${term}%,
        address->>street.ilike.%${term}%,
        address->>number.ilike.%${term}%
      `);

      // 2. Features (array → texto)
      query = query.ilike('features', `%${term}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro Supabase:', error);
      setError(`Erro: ${error.message}`);
      setProperties([]);
      return;
    }

    console.log(`${data?.length || 0} imóveis encontrados`);
    setProperties(data || []);
  } catch (err) {
    console.error('Erro fatal:', err);
    setError('Servidor tá de boa?');
  } finally {
    setLoading(false);
  }
}, [searchTerm, filterStatus]);

  // Debounce na busca
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProperties();
    }, 400);

    return () => clearTimeout(timer);
  }, [fetchProperties]);

  // Adicionar imóvel
  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingProperty(true);

    try {
      if (!formData.title.trim()) return alert('Título é obrigatório, irmão!');
      if (!formData.price || isNaN(Number(formData.price))) return alert('Preço tem que ser número!');
      if (!formData.size || isNaN(Number(formData.size))) return alert('Área também é número!');

      const propertyData = {
        title: formData.title.trim(),
        type: formData.type,
        price: Number(formData.price),
        size: Number(formData.size),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        address: JSON.stringify({
          neighborhood: formData.neighborhood.trim(),
          city: formData.city.trim(),
          state: formData.state.trim()
        }),
        status: 'available' as const,
        code: `PROP${Date.now().toString().slice(-6)}`
      };

      const { error } = await supabase.from('properties').insert(propertyData);

      if (error) {
        console.error('Erro ao inserir:', error);
        alert(
          error.code === '23505'
            ? 'Esse código já existe!'
            : `Erro: ${error.message}`
        );
        return;
      }

      alert('Imóvel adicionado com sucesso!');
      setShowAddForm(false);
      setFormData({
        title: "", type: "apartment", price: "", size: "", bedrooms: "2",
        bathrooms: "1", neighborhood: "", city: "São Paulo", state: "SP"
      });
      fetchProperties();
    } catch (err) {
      alert('Deu ruim total. Tenta de novo.');
    } finally {
      setAddingProperty(false);
    }
  };

  // Deletar imóvel
  const handleDeleteProperty = async (id: string) => {
    if (!confirm('Tem certeza? Vai apagar esse imóvel pra sempre!')) return;

    try {
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (error) throw error;

      console.log('Imóvel deletado');
      fetchProperties();
    } catch (err) {
      alert('Erro ao deletar. Tenta de novo.');
    }
  };

  // Formatadores
  const formatPrice = (price: number | null) =>
    price ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price) : '—';

  const getStatusDisplay = (status: string) => {
    const map = {
      available: { text: 'Disponível', class: 'bg-green-100 text-green-800' },
      sold: { text: 'Vendido', class: 'bg-blue-100 text-blue-800' },
      pending: { text: 'Pendente', class: 'bg-yellow-100 text-yellow-800' }
    };
    return map[status as keyof typeof map] || { text: status, class: 'bg-gray-100 text-gray-800' };
  };

  const getTypeDisplay = (type: string) => {
    const map: Record<string, string> = {
      apartment: 'Apartamento', house: 'Casa', loft: 'Loft',
      commercial: 'Comercial', land: 'Terreno'
    };
    return map[type] || type;
  };

  const getNeighborhood = (address: string | null) => {
    try {
      if (!address) return 'Sem endereço';
      const parsed = JSON.parse(address);
      return parsed.neighborhood || parsed.city || 'Sem bairro';
    } catch {
      return 'Endereço inválido';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <AdminSidebar />
        <main className="ml-64 pt-20 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando os imóveis...</p>
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
            <h1 className="text-3xl font-bold mb-2">Gerenciar Imóveis</h1>
            <p className="text-muted-foreground">{properties.length} imóveis no sistema</p>
          </div>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" /> Adicionar Imóvel
          </Button>
        </div>

        {/* Modal de Cadastro */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Novo Imóvel</h2>
                <Button variant="ghost" onClick={() => setShowAddForm(false)}>✕</Button>
              </div>

              <form onSubmit={handleAddProperty} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Título</label>
                    <Input
                      placeholder="Ex: Loft na Vila Madalena"
                      value={formData.title}
                      onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Tipo</label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={formData.type}
                      onChange={e => setFormData(p => ({ ...p, type: e.target.value }))}
                    >
                      <option value="apartment">Apartamento</option>
                      <option value="house">Casa</option>
                      <option value="loft">Loft</option>
                      <option value="commercial">Comercial</option>
                      <option value="land">Terreno</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Preço (R$)</label>
                    <Input
                      placeholder="850000"
                      value={formData.price}
                      onChange={e => setFormData(p => ({ ...p, price: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Área (m²)</label>
                    <Input
                      placeholder="95"
                      value={formData.size}
                      onChange={e => setFormData(p => ({ ...p, size: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Quartos</label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={formData.bedrooms}
                      onChange={e => setFormData(p => ({ ...p, bedrooms: e.target.value }))}
                    >
                      {[1, 2, 3, 4, 5].map(n => (
                        <option key={n} value={n}>{n} Quarto{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Banheiros</label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={formData.bathrooms}
                      onChange={e => setFormData(p => ({ ...p, bathrooms: e.target.value }))}
                    >
                      {[1, 2, 3, 4].map(n => (
                        <option key={n} value={n}>{n} Banheiro{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Bairro</label>
                    <Input
                      placeholder="Vila Madalena"
                      value={formData.neighborhood}
                      onChange={e => setFormData(p => ({ ...p, neighborhood: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Cidade</label>
                    <Input
                      placeholder="São Paulo"
                      value={formData.city}
                      onChange={e => setFormData(p => ({ ...p, city: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Estado</label>
                    <Input
                      placeholder="SP"
                      value={formData.state}
                      onChange={e => setFormData(p => ({ ...p, state: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={addingProperty}>
                    {addingProperty ? 'Adicionando...' : 'Salvar Imóvel'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Barra de Busca e Filtro */}
        <Card className="shadow-card mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Busque por MG, piscina, Rua Fictícia, código..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Todos os status</option>
                  <option value="available">Disponível</option>
                  <option value="sold">Vendido</option>
                  <option value="pending">Pendente</option>
                </select>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("all");
                  }}
                >
                  <Filter className="h-4 w-4 mr-2" /> Limpar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela */}
        <Card className="shadow-card">
          <CardContent className="p-0">
            {error ? (
              <div className="p-8 text-center text-destructive">
                <p className="mb-4">{error}</p>
                <Button onClick={fetchProperties}>Tentar Novamente</Button>
              </div>
            ) : properties.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground mb-4">
                  {searchTerm || filterStatus !== 'all'
                    ? 'Nenhum imóvel com esse filtro, mano'
                    : 'Nenhum imóvel cadastrado ainda'}
                </p>
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Adicionar Primeiro
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Imóvel</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Área</TableHead>
                    <TableHead>Quartos</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((p) => {
                    const statusInfo = getStatusDisplay(p.status);
                    return (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.code || '—'}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{p.title || 'Sem título'}</div>
                            <div className="text-sm text-muted-foreground">
                              {getNeighborhood(p.address)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getTypeDisplay(p.type)}</TableCell>
                        <TableCell className="font-semibold">{formatPrice(p.price)}</TableCell>
                        <TableCell>{p.size || '—'}m²</TableCell>
                        <TableCell>{p.bedrooms || '—'}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${statusInfo.class}`}>
                            {statusInfo.text}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteProperty(p.id)}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Status da Conexão */}
        <div className="mt-4 p-4 bg-muted rounded-lg flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Conexão</h3>
            <p className="text-sm text-muted-foreground">
              {error ? 'Offline' : properties.length > 0 ? 'Online e funcionando' : 'Aguardando dados...'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchProperties} disabled={loading}>
              {loading ? 'Atualizando...' : 'Atualizar'}
            </Button>
            <Button size="sm" onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" /> Adicionar
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminProperties;