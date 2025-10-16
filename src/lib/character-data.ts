export type Character = {
  name: string;
  concept: string;
  focus: {
    physical: {
      vigor: { value: number; max: number };
      attributes: { name: string; value: number }[];
      skills: { name: string; value: number }[];
    };
    mental: {
      focus: { value: number; max: number };
      attributes: { name: string; value: number }[];
      skills: { name: string; value: number }[];
    };
    social: {
      grace: { value: number; max: number };
      attributes: { name: string; value: number }[];
      skills: { name: string; value: number }[];
    };
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
};

export const characterData: Character = {
  name: 'Dahl Maasen',
  concept: 'Commonare da floresta',
  focus: {
    physical: {
      vigor: { value: 8, max: 10 },
      attributes: [
        { name: 'Força', value: 3 },
        { name: 'Agilidade', value: 4 },
        { name: 'Resistência', value: 3 },
        { name: 'Vigor', value: 2 },
      ],
      skills: [
        { name: 'Atletismo', value: 4 },
        { name: 'Briga', value: 3 },
        { name: 'Furtividade', value: 5 },
        { name: 'Armas Brancas', value: 2 },
      ],
    },
    mental: {
      focus: { value: 12, max: 12 },
      attributes: [
        { name: 'Inteligência', value: 4 },
        { name: 'Raciocínio', value: 3 },
        { name: 'Percepção', value: 5 },
        { name: 'Intelecto', value: 3 },
      ],
      skills: [
        { name: 'Investigação', value: 4 },
        { name: 'Conhecimento', value: 3 },
        { name: 'Medicina', value: 2 },
        { name: 'Sobrevivência', value: 5 },
      ],
    },
    social: {
      grace: { value: 9, max: 10 },
      attributes: [
        { name: 'Carisma', value: 3 },
        { name: 'Manipulação', value: 2 },
        { name: 'Autocontrole', value: 4 },
        { name: 'Empatia', value: 3 },
      ],
      skills: [
        { name: 'Empatia com Animais', value: 5 },
        { name: 'Intimidação', value: 2 },
        { name: 'Persuasão', value: 3 },
        { name: 'Lábia', value: 1 },
      ],
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
};
