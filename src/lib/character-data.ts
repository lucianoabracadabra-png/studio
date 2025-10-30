import type { LucideIcon } from "lucide-react";
import { Droplets, Wind, Star, Flame, Mountain, Shield, Anchor, Leaf, Heart } from 'lucide-react';
import allItems from './data/items.json';

// Base Item Type from the new items.json
export type BaseItem = {
    id: string;
    name: string;
    type: 'Armadura' | 'Arma' | 'Acessório' | 'Projétil' | 'Item';
    equippable: boolean;
    weight: number;
    extras: string;
    quantity?: number;
};

// Specific Item Types extending BaseItem
export type Armor = BaseItem & {
    type: 'Armadura';
    slashing: number;
    bludgeoning: number;
    piercing: number;
    coverage: string;
    resistance: number;
    durability: number;
    size: 'pp' | 'p' | 'm' | 'g' | 'gg';
};

export type WeaponAttack = {
    damage: string;
    type: string;
    ap: number;
    accuracy: number;
};

export type Weapon = BaseItem & {
    type: 'Arma';
    thrust?: WeaponAttack;
    swing?: WeaponAttack;
    size: 'pp' | 'p' | 'm' | 'g' | 'gg';
};

export type Accessory = BaseItem & {
    type: 'Acessório';
    typeAndDescription: string;
    effect: string;
};

export type Projectile = BaseItem & {
    type: 'Projétil';
    damage_type: string;
    ap: number;
    accuracy: number;
    size: 'pp' | 'p' | 'm' | 'g' | 'gg';
};

export type GeneralItem = BaseItem & {
    type: 'Item';
};

// Union type for any item from the database
export type ItemFromDB = Armor | Weapon | Accessory | Projectile | GeneralItem;

// Type for an item the character owns (hydrated with DB data)
export type CharacterItem = ItemFromDB & {
  isEquipped: boolean;
  currentQuantity?: number;
};


export type ItemOwnership = {
  itemId: string;
  equipped: boolean;
  currentQuantity?: number;
};

// Character Data Structure
type Stat = { name: string; value: number };

type FocusData = {
  attributes: Stat[];
  skills: Stat[];
};

type PhysicalFocus = FocusData & {
  vigor: { name: string; };
  treinamentos: Stat[];
};

type MentalFocus = FocusData & {
  focus: { name: string; };
  ciencias: Stat[];
};

type SocialFocus = FocusData & {
  grace: { name: string; };
  artes: Stat[];
};

export type HealthState = 'clean' | 'simple' | 'lethal' | 'aggravated';

export type BodyPartHealth = {
    name: string;
    states: HealthState[];
};

export type LanguageFamily = {
    root: string;
    dialects: string[];
}

export type SoulDomain = {
    name: string;
    level: number;
    color: string;
    icon: keyof typeof iconMap;
}

export type PersonalityTrait = { 
    name: string; 
    value: number,
    icon: keyof typeof iconMap;
    colorHsl: string;
};

export type AlignmentAxis = {
  name: string;
  state: string;
  poles: [string, string];
};

export type Fluxo = {
  name: 'Fluxo';
  value: number;
  icon: keyof typeof iconMap;
  colorHsl: string;
};

export type Patrono = {
  name: 'Patrono';
  value: number;
  icon: keyof typeof iconMap;
  colorHsl: string;
};

export const iconMap: { [key: string]: LucideIcon } = {
    Droplets,
    Wind,
    Star,
    Flame,
    Mountain,
    Shield,
    Anchor,
    Leaf,
    Heart,
};

export type Character = {
  name: string;
  concept: string;
  info: {
    imageUrl: string;
    imageHint: string;
    altura: string;
    peso: string;
    cabelo: string;
    olhos: string;
    pele: string;
    idade: string;
    ideais: string;
    origem: string;
    idiomas: string[];
    experiencia: {
        atual: number;
        total: number;
    }
  },
  health: {
    bodyParts: {
        head: BodyPartHealth;
        torso: BodyPartHealth;
        leftArm: BodyPartHealth;
        rightArm: BodyPartHealth;
        leftLeg: BodyPartHealth;
        rightLeg: BodyPartHealth;
    }
  },
  focus: {
    physical: PhysicalFocus;
    mental: MentalFocus;
    social: SocialFocus;
  };
  spirit: {
    personality: PersonalityTrait[];
    alignment: AlignmentAxis[];
  };
  soul: {
    anima: {
      fluxo: Fluxo;
      patrono: Patrono;
    };
    domains: SoulDomain[];
    cracks: number;
  };
  equipment: ItemOwnership[];
};

export const languages: LanguageFamily[] = [
    { root: 'Tantumá', dialects: ['Aztanak', 'Tupaguá', 'Mayantun', 'Anaské'] },
    { root: 'Uhzdin', dialects: ['Voslank', 'Manzhufā', 'Han Gul', 'Ylavik'] },
    { root: 'Eilen', dialects: ['Piogriessini', 'Battan', 'Semoari', 'Valius'] },
    { root: 'Ma’isha', dialects: ['Meemiri', 'Ofoês', 'Igbalim', 'Bagi'] },
    { root: 'Kamarin', dialects: ['Rakai', 'Mairake', 'Huo-ni'] },
    { root: 'Botokata', dialects: ['Tokamey', 'Bomatan', 'Akobo'] },
    { root: 'Dongalin', dialects: ['Kahakaka', 'Ogoron'] }
];

export const getNextAlignmentState = (currentState: string, poles: [string, string]): string => {
    return currentState === poles[0] ? poles[1] : poles[0];
}

// Create a map for quick item lookup
export const itemDatabase = new Map<string, ItemFromDB>(
    allItems.items.map(item => [item.id, item as ItemFromDB])
);

export const alignmentDescriptions = {
  'Moral': {
    title: 'Eixo da Moral: Egoísmo vs. Altruísmo',
    explanation: 'Este eixo mede a preocupação fundamental do personagem: o eu ou o outro.',
    poles: {
      'Egoísmo': 'O personagem prioriza as suas próprias necessidades, segurança e felicidade acima de tudo.',
      'Altruísmo': 'O personagem prioriza o bem-estar, segurança e felicidade dos outros, mesmo com custo pessoal.'
    }
  },
  'Ética': {
    title: 'Eixo da Ética: Rebeldia vs. Ordem',
    explanation: 'Este eixo mede a relação do personagem com leis, tradições e estruturas de poder.',
    poles: {
      'Rebeldia': 'O personagem valoriza a liberdade pessoal e a consciência individual acima das regras e convenções sociais.',
      'Ordem': 'O personagem acredita em regras, hierarquias e códigos estabelecidos como a melhor forma de governar.'
    }
  },
  'Identidade': {
    title: 'Eixo da Identidade: Comunitarismo vs. Individualismo',
    explanation: 'Este eixo define onde o personagem encontra o seu sentido de identidade.',
    poles: {
      'Comunitarismo': 'A identidade do personagem é definida pelo seu papel no grupo, família, clã ou sociedade.',
      'Individualismo': 'A identidade do personagem é definida pelas suas próprias conquistas, crenças e qualidades únicas.'
    }
  },
  'Abordagem': {
    title: 'Eixo da Abordagem: Lógica vs. Instinto',
    explanation: 'Este eixo descreve o método primário do personagem para tomar decisões e resolver problemas.',
    poles: {
      'Lógica': 'O personagem confia na razão, análise e planeamento cuidadoso para navegar o mundo.',
      'Instinto': 'O personagem confia nos seus sentimentos, intuição e reações viscerais para guiar as suas ações.'
    }
  },
  'Verdade': {
    title: 'Eixo da Verdade: Idealismo vs. Pragmatismo',
    explanation: 'Este eixo mede como o personagem percebe e interage com o conceito de verdade.',
    poles: {
      'Idealismo': 'O personagem acredita em verdades absolutas e princípios morais que não devem ser comprometidos.',
      'Pragmatismo': 'O personagem acredita que a verdade é relativa e que o melhor curso de ação é aquele que funciona.'
    }
  },
  'Poder': {
    title: 'Eixo do Poder: Liberdade vs. Contenção',
    explanation: 'Este eixo define a atitude do personagem em relação ao uso da força e da influência.',
    poles: {
      'Liberdade': 'O personagem acredita que o poder deve ser usado livremente para atingir os seus objetivos, sem restrições.',
      'Contenção': 'O personagem acredita que o poder deve ser usado com grande cuidado, moderação e responsabilidade.'
    }
  }
};
