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
  vigor: { value: number; max: number };
  treinamentos: Stat[];
};

type MentalFocus = FocusData & {
  focus: { value: number; max: number };
  ciencias: Stat[];
};

type SocialFocus = FocusData & {
  grace: { value: number; max: number };
  artes: Stat[];
};

export type Character = {
  name: string;
  concept: string;
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
    domains: { name: string; level: number }[];
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

export const characterData: Character = {
  name: 'Dahl Maasen',
  concept: 'Commonare da floresta',
  focus: {
    physical: {
      vigor: { value: 8, max: 10 },
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
      focus: { value: 12, max: 12 },
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
      grace: { value: 9, max: 10 },
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
        { name: 'Coragem', value: 7 },
        { name: 'Convicção', value: 8 },
        { name: 'Compostura', value: 5 },
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
      { name: 'Matéria', level: 2 },
      { name: 'Mente', level: 1 },
      { name: 'Espírito', level: 0 },
      { name: 'Tempo', level: 0 },
      { name: 'Espaço', level: 1 },
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
