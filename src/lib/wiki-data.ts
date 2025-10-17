import { BookCopy, User, DraftingCompass, ScrollText, type LucideIcon } from "lucide-react";

export type WikiPage = {
    id: string;
    title: string;
    summary: string;
    content: string;
};

export type Portal = {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    icon: keyof typeof iconMap;
    colorHue: number;
    pages: WikiPage[];
};

export const portals: Portal[] = [
    {
        id: 'grimorio-do-mundo',
        title: 'O Grimório do Mundo',
        subtitle: 'A Lore e a Cosmologia',
        description: 'Mergulhe na filosofia, cosmologia e história que dão alma ao universo. Este portal é a porta de entrada para o contexto que fundamenta todas as regras e aventuras.',
        icon: 'BookCopy',
        colorHue: 280,
        pages: [
            {
                id: 'cosmologia',
                title: 'Cosmologia',
                summary: 'O documento mais importante da lore, explicando a origem e a física do universo.',
                content: 'A história do Vazio, o surgimento do Desejo e de Babsin. A definição do Anima como a energia da jornada e do Fluxo como a consequência do movimento dos Umoyá.',
            },
            {
                id: 'elementos',
                title: 'Os Elementos',
                summary: 'Uma página dedicada a explicar a natureza dos elementos e a dança da criação.',
                content: 'A explicação detalhada dos dois pilares (Movimento vs. Estrutura e Divergência vs. Convergência). Uma seção para cada elemento (Fogo, Terra, Ar, Água), descrevendo a sua "personalidade" e a "dança" dos seus Umoyá.',
            },
            {
                id: 'natureza-do-ser',
                title: 'A Natureza do Ser',
                summary: 'Explica a composição metafísica de cada personagem: Alma, Espírito e Patrono.',
                content: 'A definição da Alma (essência, Atributos, Perícias), do Espírito (expressão, Personalidade) e do Patrono (o agente, a forma animal da alma que transporta a mana).',
            },
            {
                id: 'historia-geografia',
                title: 'História & Geografia',
                summary: 'O palco onde as aventuras acontecem. A linha do tempo e os locais de poder.',
                content: 'Uma linha do tempo dos eventos principais, um mapa do mundo e descrições breves das nações, cidades e locais de poder.',
            },
            {
                id: 'faccoes-culturas',
                title: 'Facções & Culturas',
                summary: 'Os principais intervenientes do mundo, desde impérios a cultos secretos.',
                content: 'Descrições das guildas de magos, impérios, cultos do Vazio, ordens de cavaleiros e outras organizações importantes.',
            },
        ],
    },
    {
        id: 'caminho-do-heroi',
        title: 'O Caminho do Herói',
        subtitle: 'O Manual do Jogador',
        description: 'Tudo o que um jogador precisa para criar, desenvolver e jogar com o seu personagem. As regras são organizadas para seguir a jornada de aprendizagem.',
        icon: 'User',
        colorHue: 240,
        pages: [
            {
                id: 'criacao-de-personagem',
                title: 'Criação de Personagem',
                summary: 'O ponto de partida para qualquer jogador. Um guia tutorial passo a passo.',
                content: 'Um roteiro passo a passo que linka para todas as outras páginas relevantes deste portal ("Passo 1: Entenda a Trindade do Ser", "Passo 2: Defina seus Atributos", etc.).',
            },
            {
                id: 'atributos-pericias',
                title: 'Atributos e Perícias',
                summary: 'A lista completa das capacidades inatas e treinadas.',
                content: 'A lista e descrição dos 12 Atributos e do Kit Universal de 24 Perícias. Explica a diferença entre o kit fixo e as Perícias de Especialidade. Cada Atributo deve linkar para as Perícias que o utilizam.',
            },
            {
                id: 'valores-animicos',
                title: 'Valores Anímicos',
                summary: 'Uma página dedicada às estatísticas mais importantes da sua alma: Fluxo & Patrono.',
                content: 'Explica a função mecânica do Fluxo (limite de mana por feitiço) e do Patrono (regeneração de mana e base para o teste de "Evocar Patrono").',
            },
            {
                id: 'personalidade-alinhamento',
                title: 'Personalidade e Alinhamento',
                summary: 'As regras para definir a bússola interior do personagem.',
                content: 'Explica as três Perícias de Personalidade e os 6 Eixos de Alinhamento, incluindo como o sistema de espectro numérico funciona.',
            },
            {
                id: 'acoes-testes',
                title: 'Ações e Testes',
                summary: 'O motor central de resolução de ações no sistema.',
                content: 'A explicação detalhada do Teste de Atributo (Roll Under) e do Teste de Perícia (Parada de Dados). Inclui a Escala de Sucesso.',
            },
            {
                id: 'regras-de-combate',
                title: 'Regras de Combate',
                summary: 'Como a iniciativa e a ordem de ação funcionam na Linha do Tempo Contínua.',
                content: 'A explicação completa do Teste de Reação e do sistema da Linha de Tempo Contínua, incluindo as regras para "Janela de Oposição" e "Ação Combinada".',
            },
            {
                id: 'saude-dano-condicoes',
                title: 'Saúde, Dano e Condições',
                summary: 'As regras para a sobrevivência e as suas consequências.',
                content: 'Explica como a saúde funciona, como o dano é calculado e uma lista das Condições e seus efeitos.',
            },
        ],
    },
    {
        id: 'manto-do-arquiteto',
        title: 'O Manto do Arquiteto',
        subtitle: 'O Guia do Mestre',
        description: 'Ferramentas, regras avançadas e conselhos para a pessoa que irá narrar o jogo. Este é o "lado B" do sistema, com os segredos da engenharia da magia.',
        icon: 'DraftingCompass',
        colorHue: 65,
        pages: [
            {
                id: 'arte-de-mestrar',
                title: 'A Arte de Mestrar',
                summary: 'Conselhos e diretrizes para conduzir uma sessão de jogo.',
                content: 'Dicas sobre como gerir a Linha de Tempo, arbitrar a magia improvisada e criar desafios narrativos.',
            },
            {
                id: 'fisica-dos-passos',
                title: 'A Física dos Passos',
                summary: 'A página central do sistema de magia: a Engenharia de Magia.',
                content: 'A explicação completa da mecânica dos Passos, do Acúmulo de Sucessos e da "Falha em Cascata" (Backlash e Efeito Pervertido).',
            },
            {
                id: 'arquiteto-arcano',
                title: 'O Arquiteto Arcano',
                summary: 'A ferramenta do Mestre para criar e equilibrar qualquer magia com Pontos de Complexidade.',
                content: 'A Tabela de Pontos de Complexidade (PC) e as fórmulas de conversão. Deve ter um link para o "Construtor de Magias" interativo.',
            },
            {
                id: 'corrupcao-do-vazio',
                title: 'A Corrupção do Vazio',
                summary: 'As regras completas para a mecânica de corrupção, as Rachaduras na alma.',
                content: 'Detalha como se ganham Rachaduras e a mecânica do "Dado da Volatilidade" e do "Vórtice do Silêncio".',
            },
        ],
    },
    {
        id: 'catalogo-da-criacao',
        title: 'O Catálogo da Criação',
        subtitle: 'Bases de Dados',
        description: 'A seção de referência prática do jogo, contendo listas e catálogos de todos os "objetos" do jogo, desde equipamentos e itens mágicos a monstros e feitiços.',
        icon: 'ScrollText',
        colorHue: 30,
        pages: [
            {
                id: 'arsenal-mundano',
                title: 'Arsenal Mundano',
                summary: 'Uma base de dados de armas, armaduras e equipamentos.',
                content: 'Tabelas com as estatísticas de cada item, incluindo os custos em AP das armas.',
            },
            {
                id: 'geradores-de-itens',
                title: 'Geradores de Itens',
                summary: 'As regras e tabelas para criar itens únicos.',
                content: 'Os geradores para Equipamentos Mundanos, Itens Mágicos e as diretrizes para Artefatos.',
            },
            {
                id: 'bestiario',
                title: 'Bestiário',
                summary: 'Uma base de dados de criaturas e antagonistas.',
                content: 'Páginas individuais para cada criatura, com o seu "bloco de estatísticas" completo e uma descrição da sua lore.',
            },
            {
                id: 'grimorio-de-exemplos',
                title: 'Grimório de Exemplos',
                summary: 'Uma coleção de magias pré-construídas, prontas para usar.',
                content: 'Páginas individuais para cada magia, apresentadas como "cartas de feitiço", detalhando seus Passos, Sucessos Alvo, e a "Qualidade do Sucesso".',
            },
        ],
    },
];

export const iconMap: { [key: string]: LucideIcon } = {
    BookCopy,
    User,
    DraftingCompass,
    ScrollText,
};
