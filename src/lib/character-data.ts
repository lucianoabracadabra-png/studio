
import type { LucideIcon } from "lucide-react";
import { Droplets, Wind, Star, Flame, Mountain, Shield, Anchor, Leaf } from 'lucide-react';
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
    Leaf
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
