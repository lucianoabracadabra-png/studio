export type BagItem = {
  name: string;
  quantity: number;
  weight: number;
  extras: string;
};

export type Armor = {
  name: string;
  slashing: number;
  bludgeoning: number;
  piercing: number;
  coverage: string;
  resistance: number;
  durability: number;
  size: 'pp' | 'p' | 'm' | 'g' | 'gg';
  weight: number;
  extras: string;
  equipped: boolean;
};

export type WeaponAttack = {
  damage: string;
  type: string;
  ap: number;
  accuracy: number;
};

export type Weapon = {
  name: string;
  thrust?: WeaponAttack;
  swing?: WeaponAttack;
  size: 'pp' | 'p' | 'm' | 'g' | 'gg';
  weight: number;
  extras: string;
  equipped: boolean;
};

export type Accessory = {
  name: string;
  typeAndDescription: string;
  equipped: boolean;
  weight: number;
  effect: string;
};

export type Projectile = {
  name: string;
  type: string;
  ap: number;
  accuracy: number;
  quantity: number;
  weight: number;
  size: 'pp' | 'p' | 'm' | 'g' | 'gg';
  extras: string;
};

type Stat = { name: string; value: number };

type FocusData = {
  attributes: Stat[];
  skills: Stat[];
};

type PhysicalFocus = FocusData & {
  vigor: { name: string; value: number; max: number };
  treinamentos: Stat[];
};

type MentalFocus = FocusData & {
  focus: { name: string; value: number; max: number };
  ciencias: Stat[];
};

type SocialFocus = FocusData & {
  grace: { name: string; value: number; max: number };
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
    bonus: number;
    color: string;
    symbol: string;
}

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
    personality: { name: string; value: number }[];
    alignment: { name: string; value: number; poles: [string, string] }[];
  };
  soul: {
    anima: {
      flow: number;
      patron: number;
    };
    domains: SoulDomain[];
    cracks: number;
  };
  inventory: {
    bag: BagItem[];
  };
  equipment: {
    armors: Armor[];
    weapons: Weapon[];
    accessories: Accessory[];
    projectiles: Projectile[];
  };
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


export const characterData: Character = {
  name: 'Dahl Maasen',
  concept: 'Guerreiro tribal das florestas do norte',
  info: {
    imageUrl: '', // Will be populated from placeholder-images
    imageHint: 'male warrior fantasy',
    altura: '185 cm',
    peso: '140 kg',
    cabelo: 'Castanho grisalho, longo',
    olhos: 'Âmbar',
    pele: 'Persa, queimada de sol',
    idade: '29 anos',
    ideais: 'Família, conhecimento e liberdade',
    origem: 'Commonare da floresta',
    idiomas: ['Tantumá', 'Tupaguá', 'Uhzdin', 'Manzhufā'],
    experiencia: {
        atual: 0,
        total: 369
    }
  },
  health: {
      bodyParts: {
          head: { name: 'Cabeça', states: Array(6).fill('clean') },
          torso: { name: 'Tronco', states: Array(12).fill('clean') },
          leftArm: { name: 'Braço Esquerdo', states: Array(9).fill('clean') },
          rightArm: { name: 'Braço Direito', states: Array(9).fill('clean') },
          leftLeg: { name: 'Perna Esquerda', states: Array(9).fill('clean') },
          rightLeg: { name: 'Perna Direita', states: Array(9).fill('clean') },
      }
  },
  focus: {
    physical: {
      vigor: { name: "Vigor", value: 8, max: 10 },
      attributes: [
        { name: 'Força', value: 3 },
        { name: 'Destreza', value: 4 },
        { name: 'Agilidade', value: 3 },
        { name: 'Constituição', value: 2 },
      ],
      skills: [
        { name: 'Armas Brancas', value: 2 },
        { name: 'Armas de Fogo', value: 0 },
        { name: 'Arquearia', value: 3 },
        { name: 'Arremesso', value: 1 },
        { name: 'Briga', value: 3 },
        { name: 'Combate', value: 2 },
        { name: 'Furtividade', value: 5 },
        { name: 'Prontidão', value: 4 },
      ],
      treinamentos: [
          { name: 'Corrida', value: 2 },
          { name: 'Natação', value: 1 },
          { name: 'Escalada', value: 3 },
          { name: 'Pilotagem', value: 0 },
      ]
    },
    mental: {
      focus: { name: "Foco", value: 12, max: 12 },
      attributes: [
        { name: 'Inteligência', value: 4 },
        { name: 'Percepção', value: 5 },
        { name: 'Raciocínio', value: 3 },
        { name: 'Sabedoria', value: 3 },
      ],
      skills: [
        { name: 'Acadêmicos', value: 2 },
        { name: 'Armadilhas', value: 3 },
        { name: 'Intuição', value: 4 },
        { name: 'Investigação', value: 4 },
        { name: 'Medicina', value: 2 },
        { name: 'Ocultismo', value: 1 },
        { name: 'Segurança', value: 2 },
        { name: 'Sobrevivência', value: 5 },
      ],
      ciencias: [
        { name: 'Biologia', value: 3 },
        { name: 'Física', value: 0 },
        { name: 'Química', value: 1 },
        { name: 'História', value: 2 },
      ]
    },
    social: {
      grace: { name: "Graça", value: 9, max: 10 },
      attributes: [
        { name: 'Empatia', value: 3 },
        { name: 'Manipulação', value: 2 },
        { name: 'Expressão', value: 3 },
        { name: 'Resiliência', value: 4 },
      ],
      skills: [
        { name: 'Barganha', value: 2 },
        { name: 'Doma', value: 5 },
        { name: 'Etiqueta', value: 1 },
        { name: 'Intimidação', value: 2 },
        { name: 'Lábia', value: 1 },
        { name: 'Liderança', value: 2 },
        { name: 'Montaria', value: 3 },
        { name: 'Sedução', value: 0 },
      ],
      artes: [
          { name: 'Canto', value: 1 },
          { name: 'Dança', value: 0 },
          { name: 'Pintura', value: 2 },
          { name: 'Atuação', value: 1 },
      ]
    },
  },
  spirit: {
    personality: [
        { name: 'Coragem', value: 2 },
        { name: 'Convicção', value: 4 },
        { name: 'Serenidade', value: 1 },
    ],
    alignment: [
      { name: 'Moral', value: 2, poles: ['Egoísmo', 'Altruísmo'] },
      { name: 'Ética', value: -1, poles: ['Rebeldia', 'Ordem'] },
    ],
  },
  soul: {
    anima: {
      flow: 3,
      patron: 2,
    },
    domains: [
      { name: 'Terra', level: 0, bonus: 1, color: '#22c55e', symbol: '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M2 12h20M12 2v20"/></svg>' },
      { name: 'Fogo', level: 0, bonus: 1, color: '#ef4444', symbol: '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z"/></svg>' },
      { name: 'Anima', level: 1, bonus: 2, color: '#a855f7', symbol: '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 2l3.09 6.31L22 9.31l-5.45 5.29L17.64 22 12 18.31 6.36 22l1.09-7.4L2 9.31l6.91-1L12 2z"/></svg>' },
      { name: 'Ar', level: 0, bonus: 1, color: '#eab308', symbol: '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 22L2 2h20L12 22z"/></svg>' },
      { name: 'Água', level: 0, bonus: 2, color: '#3b82f6', symbol: '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 22L2 12h20L12 22z"/></svg>' },
    ],
    cracks: 3,
  },
  inventory: {
    bag: [
      { name: 'Corda (15m)', quantity: 1, weight: 2, extras: 'Feita de cânhamo' },
      { name: 'Ração de Viagem', quantity: 5, weight: 1, extras: 'Para 5 dias' },
      { name: 'Tocha', quantity: 10, weight: 0.5, extras: 'Dura 1 hora cada' },
      { name: 'Cantil de Água', quantity: 1, weight: 1.5, extras: 'Cheio' },
    ],
  },
  equipment: {
    armors: [
      { 
        name: 'Jaqueta de Couro Batido',
        slashing: 1,
        bludgeoning: 2,
        piercing: 1,
        coverage: 'Tronco, Braços',
        resistance: 10,
        durability: 12,
        size: 'm',
        weight: 4,
        extras: 'Reforçada com placas de metal',
        equipped: true,
      },
    ],
    weapons: [
      {
        name: 'Faca de Caça',
        thrust: { damage: '1d4', type: 'Perfurante', ap: 3, accuracy: 1 },
        swing: { damage: '1d4', type: 'Cortante', ap: 4, accuracy: 0 },
        size: 'p',
        weight: 0.5,
        extras: 'Cabo de osso',
        equipped: true,
      },
      {
        name: 'Arco Curto',
        size: 'm',
        weight: 1,
        extras: 'Feito de teixo',
        equipped: true,
      }
    ],
    accessories: [
      {
        name: 'Amuleto de Dente de Lobo',
        typeAndDescription: 'Colar com um dente de lobo',
        equipped: true,
        weight: 0.1,
        effect: '+1 em testes de Intimidação',
      },
    ],
    projectiles: [
        {
            name: 'Flechas Comuns',
            type: 'Perfurante',
            ap: 3,
            accuracy: 0,
            quantity: 20,
            weight: 0.05,
            size: 'm',
            extras: 'Ponta de ferro',
        }
    ],
  },
};
