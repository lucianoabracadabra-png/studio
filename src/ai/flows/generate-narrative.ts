'use server';
/**
 * @fileOverview A generative TTRPG Game Master flow.
 *
 * - generateNarrative - A function that handles the narrative generation process.
 * - GenerateNarrativeInput - The input type for the generateNarrative function.
 * - GenerateNarrativeOutput - The return type for the generateNarrative function.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'zod';

const RolagemRequeridaSchema = z.object({
  pericia: z.string().describe("A perícia a ser testada."),
  atributo: z.string().describe("O atributo base para o teste."),
  dificuldade: z.number().describe("O valor alvo para o sucesso."),
  bonus: z.object({
    narrativa: z.number().optional(),
    esforco: z.number().optional(),
    situacional: z.number().optional(),
  }).optional(),
  alternativa: z.object({
    pericia: z.string(),
    atributo: z.string(),
  }).nullable().optional(),
});

const PlayerUpdateSchema = z.object({
    posicao: z.object({ x: z.number(), y: z.number() }).optional(),
    saude: z.object({ valor: z.number() }).optional(),
    focos: z.record(z.string(), z.object({ anima: z.object({ valor: z.number() }) })).optional(),
    inventorio_adicionar: z.array(z.object({ nome: z.string(), descricao: z.string().optional() })).optional(),
    inventorio_remover: z.array(z.string()).optional(),
    equipamento_atualizar: z.record(z.string(), z.object({ nome: z.string(), descricao: z.string().optional() }).nullable()).optional(),
});

const WorldUpdateSchema = z.record(z.string(), z.object({
    npcs_remover: z.array(z.string()).optional(),
    npcs_atualizar: z.array(z.object({
        nome: z.string(),
        atributos: z.record(z.string(), z.any()),
    })).optional(),
}));

const NovaSalaSchema = z.object({
    coords: z.string().describe("As coordenadas da nova sala, ex: '1,0'"),
    dados: z.object({
        nome: z.string(),
        descricao_base: z.string(),
        itens: z.array(z.object({ nome: z.string(), descricao: z.string().optional() })).optional(),
        npcs: z.array(z.object({ nome: z.string(), descricao: z.string(), atributos: z.record(z.string(), z.any()) })).optional(),
        saidas: z.record(z.string(), z.object({ x: z.number(), y: z.number() })).optional(),
    }),
});

const AtualizacaoEstadoSchema = z.object({
  jogador: PlayerUpdateSchema.optional(),
  mundo: WorldUpdateSchema.optional(),
  em_combate: z.boolean().optional(),
  nova_sala: NovaSalaSchema.optional(),
});

const GenerateNarrativeInputSchema = z.object({
  comando: z.string(),
  estadoJogo: z.any(),
});
export type GenerateNarrativeInput = z.infer<typeof GenerateNarrativeInputSchema>;

const GenerateNarrativeOutputSchema = z.object({
  narrativa: z.string().describe("A descrição do que aconteceu, em português do Brasil."),
  arte_ascii: z.string().describe("Uma arte ASCII detalhada (máximo 70x20 caracteres) representando a cena.").nullable(),
  rolagem_requerida: RolagemRequeridaSchema.nullable(),
  atualizacao_estado: AtualizacaoEstadoSchema.optional(),
});
export type GenerateNarrativeOutput = z.infer<typeof GenerateNarrativeOutputSchema>;


export async function generateNarrative(input: GenerateNarrativeInput): Promise<GenerateNarrativeOutput> {
  return generateNarrativeFlow(input);
}


const generateNarrativeFlow = ai.defineFlow(
  {
    name: 'generateNarrativeFlow',
    inputSchema: GenerateNarrativeInputSchema,
    outputSchema: GenerateNarrativeOutputSchema,
  },
  async (input) => {
    const { output } = await ai.prompt({
        model: googleAI.model('gemini-1.5-flash'),
        prompt: `Você é um Mestre de Jogo de um RPG de fantasia medieval sombria (século 15).
        REGRAS CRÍTICAS:
        1.  **SISTEMA DE ROLAGEM:** A rolagem usa um sistema de sucessos. O jogador rola d10s (igual à 'pericia'). Cada dado soma o 'atributo'. Um '1' no d10 é uma falha crítica (-1 sucesso). Um '10' é um crítico (valor 15) e adiciona outra rolagem de d10 para este teste. Cada resultado >= 'dificuldade' é 1 sucesso.
        2.  **FLUXO DE AÇÃO:** Se o comando começar com "[SISTEMA]", é o resultado de uma rolagem. Narre a consequência direta com base no NÚMERO DE SUCESSOS e continue o jogo. NÃO peça outra ação.
            - < 0 sucessos: Falha Crítica com consequências negativas.
            - 0 sucessos: Falha total. A ação não é realizada.
            - 1 sucesso: Sucesso com um custo narrativo. A ação principal funciona, mas algo corre mal.
            - 2-3 sucessos: Sucesso completo.
            - 4-5 sucessos: Sucesso impressionante.
            - 6+ sucessos: Sucesso lendário com efeitos inesperados.
        3.  **PEDIR ROLAGEM:** Se uma ação for incerta, peça uma rolagem usando 'rolagem_requerida', especificando 'pericia', 'atributo' e 'dificuldade'. Se for cabível, sugira uma 'alternativa' com perícia e atributo diferentes.
        4.  **REGRAS GERAIS:** Dificuldade: Fácil (até 7), Médio (8-12), Difícil (13-15), Épico (16+). Dano é baseado em 'Força' e SÓ é aplicado após um sucesso. Vida 0 = morte. Crie novas salas na exploração. Use aspas simples (') na narrativa. A resposta DEVE estar em português do Brasil.
    
        ESTADO ATUAL: {{{json estadoJogo}}}
        COMANDO DO JOGADOR ou EVENTO DO SISTEMA: "{{{comando}}}"
        `,
        output: {
            schema: GenerateNarrativeOutputSchema
        },
        input: input,
    });
    return output;
  }
);
