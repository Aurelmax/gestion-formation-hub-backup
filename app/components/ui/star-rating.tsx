import React from "react";
import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  onChange?: (newRating: number) => void;
  size?: number;
  className?: string;
}

/**
 * Composant de notation par étoiles interactif
 * Permet l'affichage et la sélection d'une note de 0 à maxRating
 */
export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  onChange,
  size = 24,
  className,
}) => {
  // Arrondir à 0.5 près pour l'affichage des demi-étoiles
  const roundedRating = Math.round(rating * 2) / 2;
  
  // Générer les étoiles basées sur la note
  const stars = Array.from({ length: maxRating }, (_, i) => {
    const starValue = i + 1;
    const isFilled = roundedRating >= starValue;
    const isHalf = !isFilled && roundedRating + 0.5 >= starValue;
    
    const handleClick = () => {
      if (onChange) {
        onChange(starValue);
      }
    };
    
    return (
      <span 
        key={i} 
        className={cn(
          "cursor-pointer transition-colors", 
          onChange ? "hover:text-yellow-400" : "",
        )}
        onClick={handleClick}
        title={`${starValue} étoile${starValue > 1 ? 's' : ''}`}
      >
        {isFilled ? (
          <Star
            fill="currentColor"
            size={size}
            className="text-yellow-500"
          />
        ) : isHalf ? (
          <StarHalf
            fill="currentColor"
            size={size}
            className="text-yellow-500"
          />
        ) : (
          <Star
            size={size}
            className="text-gray-300"
          />
        )}
      </span>
    );
  });
  
  return (
    <div className={cn("flex items-center", className)}>
      {stars}
    </div>
  );
};
