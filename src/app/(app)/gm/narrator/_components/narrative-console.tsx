'use client';
import { useReducer, useEffect } from 'react';
import { setupGame, gameReducer } from './game-logic';
import { generateNarrativeAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

const ChatLog = ({ messages }: { messages: any[] }) => {
    return (
        <ScrollArea className="h-full pr-4">
            <div className="space-y-6">
                {messages.map((msg, index) => {
                    let autorClass = '';
                    if (msg.author === 'Mestre') autorClass = 'mestre-msg';
                    else if (msg.author === 'Sistema') autorClass = 'sistema-msg';
                    else if (msg.author === 'Arte') autorClass = 'sistema-msg';
                    else autorClass = 'jogador-msg';

                    return (
                        <div key={index} className={autorClass}>
                            {msg.author === 'Arte' ? (
                                <pre className="ascii-art">{msg.message}</pre>
                            ) : (
                                <>
                                    <div className={`font-bold font-heading ${msg.author === msg.playerName ? "text-emerald-800" : (msg.author === 'Sistema' ? 'text-sky-800' : 'text-amber-800')}`}>[{msg.author}]:</div>
                                    <div className="mt-1 msg-content" dangerouslySetInnerHTML={{ __html: msg.message }}></div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </ScrollArea>
    );
};

const CharacterSheet = ({ player }: { player: any }) => {
    if (!player) return null;
    return (
        <Card className="bg-transparent border-none shadow-none">
            <CardHeader>
                <CardTitle className="text-xl font-bold font-heading heading-text border-b-2 border-amber-800/30 pb-2">
                    PERSONAGEM
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-x-4">
                    <div><strong>Nome:</strong> {player.identidade.nome}</div>
                    <div><strong>Nível:</strong> {player.nivel}</div>
                </div>
                
                <div className="pt-4">
                    <h3 className="font-bold text-lg font-heading">Saúde</h3>
                    <div className="health-bar-bg w-full h-6 rounded-sm overflow-hidden mt-1">
                        <div className="health-bar-fill h-full text-white text-xs flex items-center justify-center" style={{ width: `${(player.saude.valor / player.saude.max) * 100}%` }}>
                            {player.saude.valor}/{player.saude.max}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 pt-4">
                    {Object.values(player.focos).map((foco: any) => (
                        <div key={foco.nome}>
                            <h3 className="font-bold text-lg font-heading">{foco.nome} ({foco.anima.nome}: {foco.anima.valor}/{foco.anima.max})</h3>
                            <ul className="list-none ml-2 text-sm">
                                {Object.entries(foco.atributos).map(([attr, val]) => <li key={attr}>{attr}: <span className="font-bold">{String(val)}</span></li>)}
                            </ul>
                            <h4 className="font-semibold mt-2">Perícias:</h4>
                            <ul className="list-none ml-2 text-sm">
                                {Object.entries(foco.pericias).map(([pericia, val]) => <li key={pericia}>{pericia}: <span className="font-bold">{String(val)}</span></li>)}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="pt-4">
                    <h3 className="font-bold text-lg font-heading">Equipamento</h3>
                    <ul className="text-sm list-none mt-2 space-y-1 grid grid-cols-2 gap-x-4">
                        {Object.entries(player.equipamento).map(([slot, item]: [string, any]) => <li key={slot}><span className="font-semibold">{slot}:</span> {item ? item.nome : '(Vazio)'}</li>)}
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
};

export function NarrativeConsole() {
    const [gameState, dispatch] = useReducer(gameReducer, null);
    const { toast } = useToast();

    useEffect(() => {
        dispatch({ type: 'INIT_GAME', payload: setupGame() });
    }, []);

    useEffect(() => {
        if (gameState?.isInitialised && !gameState.isLoading) {
            processCommand("Começar o jogo. Descreva a cena inicial.");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameState?.isInitialised]);


    const processCommand = async (command: string, isPlayerAction = false) => {
        if (!command || gameState?.isLoading) return;
        
        if (isPlayerAction) {
            dispatch({ type: 'ADD_MESSAGE', payload: { message: command, author: gameState.jogador.identidade.nome, playerName: gameState.jogador.identidade.nome } });
        }

        dispatch({ type: 'SET_LOADING', payload: true });

        const currentRoom = gameState.mundo[`${gameState.jogador.posicao.x},${gameState.jogador.posicao.y}`];
        const simplifiedPlayerState = {
            nome: gameState.jogador.identidade.nome,
            focos: {
                fisico: { anima: gameState.jogador.focos.fisico.anima, atributos: gameState.jogador.focos.fisico.atributos, pericias: gameState.jogador.focos.fisico.pericias },
                mental: { anima: gameState.jogador.focos.mental.anima, atributos: gameState.jogador.focos.mental.atributos, pericias: gameState.jogador.focos.mental.pericias },
                social: { anima: gameState.jogador.focos.social.anima, atributos: gameState.jogador.focos.social.atributos, pericias: gameState.jogador.focos.social.pericias }
            },
            saude: gameState.jogador.saude, 
            inventorio: gameState.jogador.inventorio.map((i: any) => i.nome),
            equipamento: Object.fromEntries(Object.entries(gameState.jogador.equipamento).map(([k,v]: [string, any]) => [k, v ? v.nome : null]))
        };

        const simplifiedGameState = {
            jogador: simplifiedPlayerState,
            local: { nome: currentRoom?.nome, descricao: currentRoom?.descricao_base, itens: currentRoom?.itens?.map((i: any) => i.nome), npcs: currentRoom?.npcs, saidas: currentRoom?.saidas },
            em_combate: gameState.em_combate,
            memoria_recente: gameState.memoria_recente.slice(-5)
        };

        try {
            const res = await generateNarrativeAction({ comando: command, estadoJogo: simplifiedGameState });
            dispatch({ type: 'PROCESS_IA_RESPONSE', payload: { response: res, command } });
        } catch (error) {
            console.error("Erro ao chamar a ação da IA:", error);
            toast({
                variant: "destructive",
                title: "Erro do Mestre Narrador",
                description: "Não foi possível contactar a IA. Por favor, tente novamente.",
            });
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };
    
    const processRoll = (useAlternative = false) => {
        dispatch({ type: 'PROCESS_ROLL', payload: { useAlternative, processCommand } });
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const input = e.currentTarget.elements.namedItem('command-input') as HTMLInputElement;
        processCommand(input.value, true);
        input.value = '';
    };

    if (!gameState) {
        return <div className="flex items-center justify-center h-full">Carregando...</div>;
    }
    
    const currentRoom = gameState.mundo[`${gameState.jogador.posicao.x},${gameState.jogador.posicao.y}`];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-2 gap-4 h-full p-4 bg-[#3a2d21] text-[#2a211c]" style={{ fontFamily: "'Lora', serif" }}>
             <style jsx global>{`
                body { background-color: #3a2d21 !important; }
                .bento-panel { background-color: rgba(245, 238, 218, 0.92); border: 2px solid #a89877; border-radius: 0.75rem; box-shadow: 0 4px 12px rgba(0,0,0,0.5), inset 0 0 40px rgba(0,0,0,0.1); display: flex; flex-direction: column; }
                .font-heading { font-family: 'Cinzel', serif; }
                .heading-text { color: #8c1c13; text-shadow: 1px 1px 2px rgba(245, 238, 218, 0.5); }
                #command-input { background-color: #f5eeda; border: 1px solid #c8b897; color: #3a2d21; }
                #command-input:focus { outline: none; border-color: #8c1c13; box-shadow: 0 0 5px rgba(140, 28, 19, 0.5); }
                .button-game { background-color: #8c1c13; color: #f5eeda; border: 1px solid #6c160f; transition: background-color 0.3s; }
                .button-game:hover { background-color: #6c160f; }
                .prompt-char { color: #5a4d41; background-color: #f5eeda; border: 1px solid #c8b897; border-right: none; }
                pre.ascii-art { font-family: 'Roboto Mono', monospace; background-color: rgba(0,0,0,0.05); padding: 12px; border-radius: 4px; border: 1px solid #c8b897; color: #5a4d41; white-space: pre-wrap; text-align: left; line-height: 1.1; font-size: 14px; overflow-x: auto; }
                .jogador-msg { text-align: left; }
                .mestre-msg { text-align: right; }
                .sistema-msg { text-align: center; }
                .mestre-msg .msg-content { background-color: rgba(185, 157, 107, 0.1); border-right: 3px solid #b99d6b; padding: 8px 12px; border-radius: 4px 0 0 4px; line-height: 1.6; display: inline-block; text-align: left; }
                .jogador-msg .msg-content { font-style: italic; color: #5a4d41; padding: 4px 0; }
                .sistema-msg .msg-content { font-style: italic; color: #5a4d41; padding: 4px 0; display: inline-block; border-top: 1px solid #c8b897; border-bottom: 1px solid #c8b897; padding: 4px 12px; }
                .health-bar-bg { background-color: #d1c5a8; border: 1px solid #a89877; }
                .health-bar-fill { background-color: #8c1c13; transition: width 0.5s ease-in-out; }
            `}</style>

            <section id="chat-panel" className="bento-panel lg:col-span-2 lg:row-span-2 p-4">
                <h2 className="text-xl font-bold font-heading heading-text border-b-2 border-amber-800/30 pb-2 mb-4 flex-shrink-0">DIÁRIO DE AVENTURA</h2>
                <div className="flex-grow overflow-hidden pr-2 mb-4 relative">
                    <ChatLog messages={gameState.messages} />
                </div>
                <div id="action-container" className="mt-auto flex-shrink-0">
                    {gameState.rolagem_pendente ? (
                        <div>
                            <div className="text-center mb-2" dangerouslySetInnerHTML={{ __html: gameState.rolagemPendenteTexto || '' }}></div>
                            <div className="flex gap-2 justify-center">
                                <Button onClick={() => processRoll(false)} className="font-bold p-2 button-game rounded-md w-full md:w-auto flex-grow">Rolar Dados</Button>
                                {gameState.rolagem_pendente.alternativa && (
                                    <Button onClick={() => processRoll(true)} className="flex-shrink font-bold p-2 button-game rounded-md text-xs">Usar {gameState.rolagem_pendente.alternativa.pericia}</Button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex">
                            <span className="font-bold p-2 prompt-char rounded-l-md">&gt;</span>
                            <input type="text" name="command-input" id="command-input" className="w-full p-2" placeholder={gameState.isLoading ? "Aguardando o destino..." : "O que fazes?"} autoComplete="off" disabled={gameState.isLoading} />
                            <Button type="submit" className="font-bold p-2 button-game rounded-r-md" disabled={gameState.isLoading}>
                                {gameState.isLoading ? 'AGUARDE' : 'AGIR'}
                            </Button>
                        </form>
                    )}
                </div>
            </section>

            <aside className="bento-panel lg:col-span-2 lg:row-span-1 p-4 overflow-y-auto">
                <CharacterSheet player={gameState.jogador} />
            </aside>
            
            <aside className="bento-panel p-4 lg:col-span-1">
                <h3 className="font-bold text-lg font-heading heading-text">Presentes</h3>
                <ul className="list-none mt-2 space-y-1 overflow-y-auto">
                    {(currentRoom?.npcs || []).length === 0 ? <li className="text-amber-800/70">(Ninguém)</li> : 
                        currentRoom.npcs.map((n: any) => <li key={n.nome}>- {n.nome} {n.atributos?.Vida && <span className="text-red-700">({n.atributos.Vida} Vida)</span>}</li>)
                    }
                </ul>
            </aside>
            <aside className="bento-panel p-4 lg:col-span-1">
                <h3 className="font-bold text-lg font-heading heading-text">Inventário</h3>
                <ul className="list-none mt-2 space-y-1 overflow-y-auto">
                    {(gameState.jogador.inventorio || []).length === 0 ? <li className="text-amber-800/70">(Vazio)</li> :
                        gameState.jogador.inventorio.map((item: any) => <li key={item.nome}>- {item.nome}</li>)
                    }
                </ul>
            </aside>
        </div>
    );
}
