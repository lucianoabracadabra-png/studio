'use client';

import React, { useState } from 'react';
import type { Token } from './vtt-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface VttSidebarProps {
  tokens: Token[];
  setTokens: React.Dispatch<React.SetStateAction<Token[]>>;
}

export function VttSidebar({ tokens, setTokens }: VttSidebarProps) {
  const [newToken, setNewToken] = useState({
    name: '',
    imageUrl: 'https://picsum.photos/seed/token/50/50',
    color: '#FF0000',
  });

  const addToken = () => {
    if (!newToken.name) return;
    const newId = tokens.length > 0 ? Math.max(...tokens.map(t => t.id)) + 1 : 1;
    const tokenToAdd: Token = {
      id: newId,
      name: newToken.name,
      imageUrl: `https://picsum.photos/seed/${newId}/50/50`,
      color: newToken.color,
      position: { x: 200, y: 200 },
    };
    setTokens(prev => [...prev, tokenToAdd]);
    setNewToken({ name: '', imageUrl: `https://picsum.photos/seed/${newId+1}/50/50`, color: `#${Math.floor(Math.random()*16777215).toString(16)}`});
  };

  const removeToken = (id: number) => {
    setTokens(prev => prev.filter(t => t.id !== id));
  };
  
  return (
    <div className="w-80 h-full bg-card/70 border-l border-white/10 p-4 flex flex-col gap-4 overflow-y-auto">
      <Card className="glassmorphic-card">
        <CardHeader>
          <CardTitle>Adicionar Token</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="token-name">Nome do Token</Label>
            <Input
              id="token-name"
              value={newToken.name}
              onChange={e => setNewToken(p => ({ ...p, name: e.target.value }))}
              placeholder="Ex: Goblin, Jogador 1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="token-color">Cor</Label>
            <Input
              id="token-color"
              type="color"
              value={newToken.color}
              onChange={e => setNewToken(p => ({ ...p, color: e.target.value }))}
              className="p-1 h-10"
            />
          </div>
          <Button onClick={addToken} className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Token
          </Button>
        </CardContent>
      </Card>
      
      <Card className="glassmorphic-card flex-grow">
        <CardHeader>
          <CardTitle>Tokens no Mapa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {tokens.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm">Nenhum token no mapa.</p>
          ) : (
            tokens.map(token => (
              <div key={token.id} className="flex items-center gap-3 p-2 bg-muted/30 rounded-md">
                <div
                  className="w-8 h-8 rounded-full border-2"
                  style={{ borderColor: token.color }}
                >
                  <Image src={token.imageUrl} alt={token.name} width={32} height={32} className="rounded-full" />
                </div>
                <span className="flex-grow font-semibold text-sm">{token.name}</span>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeToken(token.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
