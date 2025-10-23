// Separating game logic for clarity

export function setupGame() {
    const classes = [
        {
            profissao: "Guerreiro",
            focos: {
                fisico: { atributos: { 'Força': 4, 'Destreza': 2, 'Agilidade': 2, 'Constituição': 3 }, pericias: { 'Armas Brancas': 3, 'Combate': 2, 'Briga': 2, 'Prontidão': 1 } },
                mental: { atributos: { 'Inteligência': 1, 'Percepção': 2, 'Raciocínio': 2, 'Sabedoria': 1 }, pericias: { 'Sobrevivência': 1 } },
                social: { atributos: { 'Empatia': 1, 'Manipulação': 1, 'Expressão': 2, 'Resiliência': 3 }, pericias: { 'Intimidação': 2 } }
            },
            inventorio: [{ nome: 'Espada Curta', descricao: 'Uma lâmina fiável.' }, { nome: 'Escudo de Madeira', descricao: 'Marcado por batalhas anteriores.' }],
            equipamento: { 'Mão Direita': { nome: 'Espada Curta' }, 'Mão Esquerda': { nome: 'Escudo de Madeira' }, 'Peito': { nome: 'Cota de Malha', descricao: 'Anéis de metal interligados.' } }
        },
        {
            profissao: "Ladrão",
            focos: {
                fisico: { atributos: { 'Força': 2, 'Destreza': 4, 'Agilidade': 3, 'Constituição': 2 }, pericias: { 'Furtividade': 3, 'Arremesso': 2, 'Armas Brancas': 2, 'Prontidão': 1 } },
                mental: { atributos: { 'Inteligência': 2, 'Percepção': 3, 'Raciocínio': 2, 'Sabedoria': 1 }, pericias: { 'Investigação': 2, 'Armadilhas': 2, 'Segurança': 1 } },
                social: { atributos: { 'Empatia': 2, 'Manipulação': 3, 'Expressão': 2, 'Resiliência': 1 }, pericias: { 'Lábia': 3, 'Barganha': 1, 'Sedução': 1 } }
            },
            inventorio: [{ nome: 'Adaga', descricao: 'Pequena e rápida.' }, { nome: 'Gazua', descricao: 'Um conjunto de ferramentas para fechaduras.'}],
            equipamento: { 'Mão Direita': { nome: 'Adaga' }, 'Peito': { nome: 'Roupas de Couro Escuro', descricao: 'Flexível e silencioso.' } }
        },
        {
            profissao: "Erudito",
            focos: {
                fisico: { atributos: { 'Força': 1, 'Destreza': 2, 'Agilidade': 2, 'Constituição': 2 }, pericias: { 'Prontidão': 1 } },
                mental: { atributos: { 'Inteligência': 4, 'Percepção': 2, 'Raciocínio': 3, 'Sabedoria': 3 }, pericias: { 'Acadêmicos': 3, 'Ocultismo': 2, 'Medicina': 2, 'Investigação': 1, 'Intuição': 1 } },
                social: { atributos: { 'Empatia': 3, 'Manipulação': 1, 'Expressão': 2, 'Resiliência': 2 }, pericias: { 'Etiqueta': 2, 'Lábia': 1 } }
            },
            inventorio: [{ nome: 'Cajado de Madeira', descricao: 'Um cajado de carvalho liso.' }, { nome: 'Tomo Vazio', descricao: 'Pronto para novas anotações.'}],
            equipamento: { 'Mão Direita': { nome: 'Cajado de Madeira' }, 'Peito': { nome: 'Robe de Estudante', descricao: 'Simples e prático.' } }
        }
    ];

    const cenariosIniciais = [
        { mundo: { "0,0": { nome: "Estrada Empoeirada", descricao_base: "Você está numa estrada de terra batida que corta uma floresta densa. O ar é húmido e cheira a folhas molhadas. Ao [norte], a estrada continua. Ao [sul], desce para um vale enevoado.", itens: [{ nome: 'Pedaço de Pão Velho', descricao: 'Um pão duro.' }], npcs: [{ nome: 'Goblin', descricao: 'Pequeno, verde e hostil.', atributos: { 'Vida': 25, 'Força': 8}}], saidas: { "norte": { "x": 0, "y": 1 }, "sul": { "x": 0, "y": -1 } } } } },
        { mundo: { "0,0": { nome: "A Taverna 'O Javali Sedento'", descricao_base: "O ar é espesso com o cheiro de cerveja barata e suor. Um bardo toca uma música melancólica num canto. O balcão de madeira está à sua frente.", itens: [], npcs: [{ nome: 'Barman Anão', descricao: 'Um anão careca e de barba espessa.', atributos: { 'Vida': 50, 'Força': 14}}], saidas: { "porta": { "x": 0, "y": 1 } } } } },
        { mundo: { "0,0": { nome: "Cela Húmida", descricao_base: "Você acorda no chão frio e húmido de uma cela de pedra. A única luz vem de uma pequena janela gradeada perto do teto. A porta de ferro sólido parece segura.", itens: [{ nome: 'Porta de Ferro', descricao: 'Uma porta pesada e trancada.'}], npcs: [{ nome: 'Rato', descricao: 'Um pequeno rato observa-o de um canto escuro.', atributos: { 'Vida': 1, 'Força': 1}}], saidas: {} } } }
    ];

    const classeEscolhida = classes[Math.floor(Math.random() * classes.length)];
    const cenarioEscolhido = cenariosIniciais[Math.floor(Math.random() * cenariosIniciais.length)];

    const baseJogador = {
        identidade: { nome: "Gideon", profissao: "Aventureiro", idade: 28, cabelo: "Castanho", peso: "82kg", origem: "Camponês", idiomas: ["Comum"], ideais: ["Sobrevivência", "Lealdade àqueles que pagam bem"] },
        alinhamento: { pilar1: "Individualismo", pilar2: "Razão", pilar3: "Integridade" },
        personalidade: { coragem: 3, conviccao: 2, serenidade: 2 },
        dominiosMagicos: ["Nenhum"], vantagens: ["Senso de Rua"], desvantagens: ["Desconfiado"],
        focos: {
            fisico: { nome: "Físico", anima: { nome: "Vigor", valor: 10, max: 10 }, atributos: { 'Força': 0, 'Destreza': 0, 'Agilidade': 0, 'Constituição': 0 }, pericias: { 'Armas Brancas': 0, 'Armas de fogo': 0, 'Arquearia': 0, 'Arremesso': 0, 'Briga': 0, 'Combate': 0, 'Furtividade': 0, 'Prontidão': 0 }, treinamentos: [] },
            mental: { nome: "Mental", anima: { nome: "Foco", valor: 8, max: 8 }, atributos: { 'Inteligência': 0, 'Percepção': 0, 'Raciocínio': 0, 'Sabedoria': 0 }, pericias: { 'Acadêmicos': 0, 'Armadilhas': 0, 'Intuição': 0, 'Investigação': 0, 'Medicina': 0, 'Ocultismo': 0, 'Segurança': 0, 'Sobrevivência': 0 }, ciencias: [] },
            social: { nome: "Social", anima: { nome: "Graça", valor: 6, max: 6 }, atributos: { 'Empatia': 0, 'Manipulação': 0, 'Expressão': 0, 'Resiliência': 0 }, pericias: { 'Barganha': 0, 'Doma': 0, 'Etiqueta': 0, 'Intimidação': 0, 'Lábia': 0, 'Liderança': 0, 'Montaria': 0, 'Sedução': 0 }, artes: [] }
        },
        saude: { valor: 100, max: 100 }, nivel: 1, posicao: { x: 0, y: 0 }
    };

    baseJogador.identidade.profissao = classeEscolhida.profissao;
    for (const focoKey in classeEscolhida.focos) {
        Object.assign(baseJogador.focos[focoKey as keyof typeof baseJogador.focos].atributos, classeEscolhida.focos[focoKey as keyof typeof classeEscolhida.focos].atributos);
        Object.assign(baseJogador.focos[focoKey as keyof typeof baseJogador.focos].pericias, classeEscolhida.focos[focoKey as keyof typeof classeEscolhida.focos].pericias);
    }
    
    const equipamentoCompleto = { 'Cabeça': null, 'Peito': null, 'Calças': null, 'Botas': null, 'Luvas': null, 'Mão Direita': null, 'Mão Esquerda': null, ...classeEscolhida.equipamento };

    return {
        jogador: { ...baseJogador, inventorio: classeEscolhida.inventorio, equipamento: equipamentoCompleto },
        mundo: cenarioEscolhido.mundo,
        em_combate: false, memoria_recente: [], rolagem_pendente: null, isLoading: true, isInitialised: false, messages: [], rolagemPendenteTexto: null,
    };
}


function applyStateUpdate(state: any, update: any, command: string) {
    if (!update) return state;

    let newState = { ...state };
    
    // Jogador
    const pUpdate = update.jogador;
    if (pUpdate) {
        if (pUpdate.posicao) newState.jogador.posicao = pUpdate.posicao;
        if (pUpdate.saude) Object.assign(newState.jogador.saude, pUpdate.saude);
        if (pUpdate.focos) {
           for (const foco in pUpdate.focos) {
               if (newState.jogador.focos[foco] && pUpdate.focos[foco].anima) {
                   Object.assign(newState.jogador.focos[foco].anima, pUpdate.focos[foco].anima);
               }
           }
        }
        if (pUpdate.inventorio_adicionar) {
            const itemsValidos = pUpdate.inventorio_adicionar.filter((item: any) => item && typeof item === 'object' && typeof item.nome === 'string');
            newState.jogador.inventorio = [...newState.jogador.inventorio, ...itemsValidos];
        }
        if (pUpdate.inventorio_remover) {
            const paraRemover = pUpdate.inventorio_remover.map((item: any) =>
                (typeof item === 'string' ? item.toLowerCase() : '')
            ).filter(Boolean);
            newState.jogador.inventorio = newState.jogador.inventorio.filter((item: any) =>
                item && typeof item.nome === 'string' && !paraRemover.includes(item.nome.toLowerCase())
            );
        }
        if(pUpdate.equipamento_atualizar) { Object.assign(newState.jogador.equipamento, pUpdate.equipamento_atualizar); }
    }

    // Mundo
    const posKey = `${pUpdate?.posicao?.x ?? state.jogador.posicao.x},${pUpdate?.posicao?.y ?? state.jogador.posicao.y}`;
    if (update.nova_sala && update.nova_sala.coords) {
        newState.mundo[update.nova_sala.coords] = update.nova_sala.dados;
    }
    const wUpdate = update.mundo;
    if (wUpdate && wUpdate[posKey] && newState.mundo[posKey]) {
        const salaUpdate = wUpdate[posKey];
        if (salaUpdate.npcs_remover) {
           const paraRemover = salaUpdate.npcs_remover.map((npc: string) => npc.toLowerCase());
           newState.mundo[posKey].npcs = newState.mundo[posKey].npcs.filter((npc: any) => !paraRemover.includes(npc.nome.toLowerCase()));
        }
        if (salaUpdate.npcs_atualizar) {
            salaUpdate.npcs_atualizar.forEach((npcAtualizado: any) => {
                const npcExistente = newState.mundo[posKey].npcs.find((n: any) => n.nome === npcAtualizado.nome);
                if(npcExistente) { Object.assign(npcExistente.atributos, npcAtualizado.atributos); }
            });
        }
    }
    
    // Outros
    if (typeof update.em_combate === 'boolean') { newState.em_combate = update.em_combate; }
    
    newState.memoria_recente = [...state.memoria_recente, { command, narrativa: update.narrativa }];
    if (newState.memoria_recente.length > 5) newState.memoria_recente.shift();
    
    return newState;
}

export function gameReducer(state: any, action: any) {
    switch (action.type) {
        case 'INIT_GAME':
            return { ...action.payload, isInitialised: true };

        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };

        case 'ADD_MESSAGE':
            return { ...state, messages: [...state.messages, action.payload] };

        case 'PROCESS_IA_RESPONSE': {
            const { response, command } = action.payload;
            let newState = { ...state };
            
            newState = applyStateUpdate(newState, response.atualizacao_estado, command);
            
            if (response.arte_ascii) {
                newState.messages = [...newState.messages, { message: response.arte_ascii, author: 'Arte' }];
            }
            newState.messages = [...newState.messages, { message: response.narrativa, author: 'Mestre' }];
            
            newState.rolagem_pendente = response.rolagem_requerida;

            if (response.rolagem_requerida) {
                const r = response.rolagem_requerida;
                const pericia = r.pericia;
                const atributo = r.atributo;
                const numDados = Object.values(state.jogador.focos).flatMap((f: any) => Object.entries(f.pericias)).find(([nome]) => nome === pericia)?.[1] || 1;
                newState.rolagemPendenteTexto = `O Mestre pede um teste de ${pericia} (${atributo}). Rolará ${numDados}d10. (Dificuldade: ${r.dificuldade})`;
            }

            newState.isLoading = !!response.rolagem_requerida;
            return newState;
        }

        case 'PROCESS_ROLL': {
            const { useAlternative, processCommand } = action.payload;
            const rolagemOriginal = state.rolagem_pendente;
            if (!rolagemOriginal) return state;

            const rolagem = useAlternative ? { ...rolagemOriginal, ...rolagemOriginal.alternativa } : rolagemOriginal;

            let atributoValor = 0;
            let periciaValor = 0;
            for (const focoKey in state.jogador.focos) {
                const foco = state.jogador.focos[focoKey];
                if (rolagem.atributo in foco.atributos) atributoValor = foco.atributos[rolagem.atributo];
                if (rolagem.pericia in foco.pericias) periciaValor = foco.pericias[rolagem.pericia];
            }
            
            const numDados = periciaValor > 0 ? periciaValor : 1;
            const bonus = rolagem.bonus || {};
            const bonusTotal = (bonus.narrativa || 0) + (bonus.esforco || 0) + (bonus.situacional || 0);

            let sucessos = 0;
            const rolagensDetalhadas = [];
            let diceToRoll = numDados;
            let i = 0;

            while (i < diceToRoll) {
                const roll = Math.floor(Math.random() * 10) + 1;
                if (roll === 1) {
                    sucessos--;
                    rolagensDetalhadas.push(`#${i + 1}! = 1(Falha Crítica) [-1 Sucesso]`);
                } else if (roll === 10) {
                    const finalDieValue = 15 + atributoValor + bonusTotal;
                    rolagensDetalhadas.push(`#${i + 1}! = 10(15) + ${atributoValor} + ${bonusTotal} = ${finalDieValue} [ ${finalDieValue >= rolagem.dificuldade ? '✔' : '❌'} ]`);
                    if (finalDieValue >= rolagem.dificuldade) sucessos++;
                    diceToRoll++;
                } else {
                    const finalDieValue = roll + atributoValor + bonusTotal;
                    rolagensDetalhadas.push(`#${i + 1} = ${roll} + ${atributoValor} + ${bonusTotal} = ${finalDieValue} [ ${finalDieValue >= rolagem.dificuldade ? '✔' : '❌'} ]`);
                    if (finalDieValue >= rolagem.dificuldade) sucessos++;
                }
                i++;
            }

            let resultadoTexto = `Teste de ${rolagem.pericia} (Dif. ${rolagem.dificuldade}): ${sucessos} SUCESSO(S)!`;
            resultadoTexto += `<br><span class="text-xs">Detalhes: ${numDados}d10 +${atributoValor}atrb +${bonusTotal}bns<br>${rolagensDetalhadas.join('<br>')}</span>`;

            processCommand(`[SISTEMA] O meu teste de ${rolagem.pericia} obteve ${sucessos} sucesso(s).`);

            return {
                ...state,
                rolagem_pendente: null,
                rolagemPendenteTexto: null,
                messages: [...state.messages, { message: resultadoTexto, author: 'Sistema' }],
            };
        }
        
        default:
            return state;
    }
}
