// components/admin/AddPropertyDialog.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { supabase } from "../../backend/app/services/SupabaseService";

// Definir a interface das props
interface AddPropertyDialogProps {
  onPropertyAdded?: () => void | Promise<void>;
}

const AddPropertyDialog = ({ onPropertyAdded }: AddPropertyDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const propertyData = {
        title: formData.title,
        type: formData.type,
        price: Number(formData.price.replace(/\D/g, '')),
        size: Number(formData.size),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        address: JSON.stringify({
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state
        }),
        status: 'available',
        code: `PROP${Date.now().toString().slice(-6)}`
      };

      const { error } = await supabase
        .from('properties')
        .insert([propertyData]);

      if (error) {
        console.error('❌ Erro ao adicionar propriedade:', error);
        alert('Erro ao adicionar imóvel');
        return;
      }

      console.log('✅ Propriedade adicionada com sucesso');
      setOpen(false);
      
      // Reset form
      setFormData({
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

      // Chamar callback se fornecido
      if (onPropertyAdded) {
        await onPropertyAdded();
      }
    } catch (err) {
      console.error('❌ Erro inesperado:', err);
      alert('Erro ao adicionar imóvel');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Imóvel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Imóvel</DialogTitle>
          <DialogDescription>
            Preencha os dados do imóvel para cadastrar no sistema.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Imóvel</Label>
              <Input
                id="title"
                placeholder="Ex: Apartamento Moderno Centro"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartamento</SelectItem>
                  <SelectItem value="house">Casa</SelectItem>
                  <SelectItem value="loft">Loft</SelectItem>
                  <SelectItem value="commercial">Comercial</SelectItem>
                  <SelectItem value="land">Terreno</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                placeholder="Ex: 850000"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="size">Área (m²)</Label>
              <Input
                id="size"
                placeholder="Ex: 85"
                value={formData.size}
                onChange={(e) => handleInputChange('size', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Quartos</Label>
              <Select value={formData.bedrooms} onValueChange={(value) => handleInputChange('bedrooms', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Quarto</SelectItem>
                  <SelectItem value="2">2 Quartos</SelectItem>
                  <SelectItem value="3">3 Quartos</SelectItem>
                  <SelectItem value="4">4 Quartos</SelectItem>
                  <SelectItem value="5">5+ Quartos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Banheiros</Label>
              <Select value={formData.bathrooms} onValueChange={(value) => handleInputChange('bathrooms', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Banheiro</SelectItem>
                  <SelectItem value="2">2 Banheiros</SelectItem>
                  <SelectItem value="3">3 Banheiros</SelectItem>
                  <SelectItem value="4">4+ Banheiros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input
                id="neighborhood"
                placeholder="Ex: Centro"
                value={formData.neighborhood}
                onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                placeholder="Ex: São Paulo"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                placeholder="Ex: SP"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adicionando...' : 'Adicionar Imóvel'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPropertyDialog;