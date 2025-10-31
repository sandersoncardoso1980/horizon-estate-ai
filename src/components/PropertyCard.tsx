import { Bed, Bath, Maximize, MapPin } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

interface PropertyCardProps {
  image: string;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
}

const PropertyCard = ({
  image,
  title,
  price,
  location,
  bedrooms,
  bathrooms,
  area,
  type,
}: PropertyCardProps) => {
  return (
    <Card className="overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group cursor-pointer">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <Badge className="absolute top-4 left-4 bg-accent">
          {type}
        </Badge>
      </div>
      <CardContent className="p-5">
        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <div className="flex items-center gap-1 text-muted-foreground mb-3">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{location}</span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              {bedrooms}
            </span>
            <span className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              {bathrooms}
            </span>
            <span className="flex items-center gap-1">
              <Maximize className="h-4 w-4" />
              {area}m²
            </span>
          </div>
        </div>
        <div className="text-2xl font-bold text-primary">{price}</div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
