
export interface FashionAnalysis {
  gender: 'male' | 'female' | 'uncertain';
  ageRange: string;
  bodyType: 'Slim' | 'Average' | 'Athletic' | 'Plus';
  facialFeatures: {
    shape: string;
    skinTone: string;
    hairColor: string;
  };
  confidence: number;
}

export interface Outfit {
  category: 'Casual' | 'Business' | 'Night';
  title: string;
  items: {
    top: string;
    bottom: string;
    shoes: string;
    accessories: string[];
  };
  colorPalette: string[];
  explanation: string;
  visualPrompt: string; // Detailed prompt for image generation
  imageUrl?: string;    // Resulting generated image
}

export interface StyleRecommendations {
  analysis: FashionAnalysis;
  outfits: Outfit[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
