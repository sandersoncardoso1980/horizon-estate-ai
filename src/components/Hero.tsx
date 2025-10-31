import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import heroImage from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 animate-fade-in">
          Encontre o Imóvel dos Seus Sonhos
        </h1>
        <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto animate-fade-in">
          Sistema inteligente de gestão imobiliária com machine learning para insights precisos
        </p>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto bg-card rounded-lg shadow-card-hover p-4 animate-slide-up">
          <div className="flex flex-col md:flex-row gap-4">
            <Input 
              placeholder="Cidade, bairro ou código do imóvel..."
              className="flex-1"
            />
            <Button className="md:w-auto w-full gap-2">
              <Search className="h-4 w-4" />
              Buscar Imóveis
            </Button>
          </div>
          
          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {["Apartamento", "Casa", "Terreno", "Comercial"].map((type) => (
              <button
                key={type}
                className="px-4 py-2 rounded-lg bg-muted hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
