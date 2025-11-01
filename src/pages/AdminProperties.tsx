import AdminSidebar from "@/components/admin/AdminSidebar";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Building2, Edit, Trash2, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { SupabaseService } from "../SupabaseService";

// --- Interfaces ---
interface Property {
  id: string;
  title: string;
  address: string; // Agora é uma string
  price: number;
  status: 'available' | 'sold' | 'rented';
  type: 'house' | 'apartment' | 'commercial';
  bedrooms: number;
  bathrooms: number;
  area: number;
  created_at: string;
  images: string[];
}

// Função para formatar o endereço a partir do objeto
const formatAddress = (addressObj: any): string => {
  if (!addressObj) return 'Endereço não informado';
  
  // Se já for uma string, retorna diretamente
  if (typeof addressObj === 'string') return addressObj;
  
  // Se for um objeto, formata o endereço
  if (typeof addressObj === 'object') {
    const { street, number, neighborhood, city, state, zip } = addressObj;
    const parts = [];
    
    if (street) parts.push(street);
    if (number) parts.push(number);
    if (neighborhood) parts.push(neighborhood);
    if (city || state) parts.push(`${city || ''}${city && state ? ' - ' : ''}${state || ''}`);
    if (zip) parts.push(`CEP: ${zip}`);
    
    return parts.filter(part => part).join(', ') || 'Endereço não informado';
  }
  
  return 'Endereço não informado';
};

const AdminProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Buscar propriedades do backend
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const propertiesData = await SupabaseService.getAllProperties();
      
      if (propertiesData && Array.isArray(propertiesData)) {
        // Mapear os dados do Supabase para a interface Property
        const mappedProperties: Property[] = propertiesData.map((prop: any) => ({
          id: prop.id,
          title: prop.title || 'Sem título',
          address: formatAddress(prop.address), // Converter objeto para string
          price: prop.price || 0,
          status: prop.status || 'available',
          type: prop.type || 'house',
          bedrooms: prop.bedrooms || 0,
          bathrooms: prop.bathrooms || 0,
          area: prop.area || 0,
          created_at: prop.created_at,
          images: prop.images || []
        }));
        
        setProperties(mappedProperties);
      }
    } catch (error) {
      console.error('Erro ao buscar propriedades:', error);
      // Fallback data para demonstração
      setProperties([
        {
          id: '1',
          title: 'Apartamento Centro',
          address: 'Rua Principal, 123 - Centro, São Paulo - SP',
          price: 850000,
          status: 'available',
          type: 'apartment',
          bedrooms: 3,
          bathrooms: 2,
          area: 85,
          created_at: '2024-01-15',
          images: []
        },
        {
          id: '2',
          title: 'Casa Zona Sul',
          address: 'Av. Beira Mar, 456 - Zona Sul, Rio de Janeiro - RJ',
          price: 1200000,
          status: 'sold',
          type: 'house',
          bedrooms: 4,
          bathrooms: 3,
          area: 180,
          created_at: '2024-01-10',
          images: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Filtrar propriedades baseado na busca e filtros
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      available: { label: 'Disponível', variant: 'default' as const },
      sold: { label: 'Vendido', variant: 'secondary' as const },
      rented: { label: 'Alugado', variant: 'outline' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.available;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    const typeIcons = {
      house: '🏠',
      apartment: '🏢',
      commercial: '🏪'
    };
    return typeIcons[type as keyof typeof typeIcons] || '🏠';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  // --- Renderização ---
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AdminSidebar />
      
      {/* Main content adaptável ao sidebar - MESMA ESTRUTURA DO ADMIN DASHBOARD */}
      <main className="lg:ml-64 pt-16 lg:pt-20 p-4 sm:p-6 lg:p-8 transition-all duration-200">
        {/* Header responsivo */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Gerenciar Imóveis</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Gerencie seu portfólio de propriedades
            </p>
          </div>
          <Button className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Adicionar Imóvel
          </Button>
        </div>

        {/* Filtros e Busca */}
        <Card className="shadow-card mb-6 sm:mb-8">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por título ou endereço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background text-sm"
              >
                <option value="all">Todos os status</option>
                <option value="available">Disponível</option>
                <option value="sold">Vendido</option>
                <option value="rented">Alugado</option>
              </select>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filtrar</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Grid de Propriedades */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Carregando propriedades...</p>
            </div>
          </div>
        ) : filteredProperties.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="p-8 text-center">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma propriedade encontrada</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Tente ajustar os filtros de busca' 
                  : 'Adicione sua primeira propriedade ao portfólio'
                }
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Imóvel
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="shadow-card hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg font-semibold line-clamp-1">
                      {getTypeIcon(property.type)} {property.title}
                    </CardTitle>
                    {getStatusBadge(property.status)}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {property.address}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Preço:</span>
                      <span className="font-semibold">{formatPrice(property.price)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Área:</span>
                      <span>{property.area}m²</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Quartos:</span>
                      <span>{property.bedrooms}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Banheiros:</span>
                      <span>{property.bathrooms}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-2">
                      <Eye className="h-4 w-4" />
                      Ver
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Status do Sistema */}
        <div className="p-4 bg-muted rounded-lg mt-6 sm:mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-sm sm:text-base">Sistema de Gerenciamento</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {properties.length} propriedades no portfólio
              </p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  <Building2 className="h-3 w-3" />
                  {properties.filter(p => p.status === 'available').length} Disponíveis
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  ✅ {properties.filter(p => p.status === 'sold').length} Vendidos
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  📝 {properties.filter(p => p.status === 'rented').length} Alugados
                </Badge>
              </div>
            </div>
            <Button 
              onClick={fetchProperties}
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={loading}
            >
              <span>Atualizar</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminProperties;
