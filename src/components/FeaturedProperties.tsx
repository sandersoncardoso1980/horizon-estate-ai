import PropertyCard from "./PropertyCard";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const FeaturedProperties = () => {
  const properties = [
    {
      image: property1,
      title: "Apartamento Moderno Centro",
      price: "R$ 850.000",
      location: "Centro, São Paulo",
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      type: "Apartamento",
    },
    {
      image: property2,
      title: "Casa de Luxo com Piscina",
      price: "R$ 1.950.000",
      location: "Alphaville, São Paulo",
      bedrooms: 4,
      bathrooms: 3,
      area: 350,
      type: "Casa",
    },
    {
      image: property3,
      title: "Loft Industrial Renovado",
      price: "R$ 680.000",
      location: "Vila Madalena, São Paulo",
      bedrooms: 2,
      bathrooms: 1,
      area: 95,
      type: "Loft",
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Imóveis em Destaque</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Selecionados com inteligência artificial baseada em suas preferências
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, index) => (
            <PropertyCard key={index} {...property} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
