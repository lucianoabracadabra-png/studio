'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface JsonViewerProps {
  data: any;
  title?: string;
}

const JsonValue = ({ value, level }: { value: any, level: number }) => {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        return <span className="text-foreground">{String(value)}</span>;
    }
    if (value === null || value === undefined) {
        return <span className="text-muted-foreground/50">null</span>;
    }
    if (Array.isArray(value)) {
        return <JsonArray data={value} level={level + 1} />;
    }
    if (typeof value === 'object') {
        return <JsonObject data={value} level={level + 1} />;
    }
    return null;
};

const JsonObject = ({ data, level }: { data: Record<string, any>, level: number }) => {
    const entries = Object.entries(data);

    return (
        <div className={cn("space-y-2", level > 0 && "pl-4 border-l ml-2")}>
            {entries.map(([key, value], index) => {
                 const isObject = typeof value === 'object' && value !== null;
                 if (isObject) {
                     return (
                         <Collapsible key={key} defaultOpen={level < 1}>
                             <CollapsibleTrigger className="flex items-center gap-1 text-accent font-semibold text-sm group">
                                 <ChevronRight className='h-4 w-4 transition-transform group-data-[state=open]:rotate-90' />
                                 {key}
                             </CollapsibleTrigger>
                             <CollapsibleContent className='pt-2'>
                                <JsonValue value={value} level={level} />
                             </CollapsibleContent>
                         </Collapsible>
                     )
                 }
                return (
                    <div key={key} className="flex gap-2 text-sm">
                        <span className="text-muted-foreground">{key}:</span>
                        <JsonValue value={value} level={level} />
                    </div>
                );
            })}
        </div>
    );
};

const JsonArray = ({ data, level }: { data: any[], level: number }) => {
    return (
        <div className={cn("space-y-3")}>
            {data.map((item, index) => {
                const isObject = typeof item === 'object' && item !== null;
                 return (
                    <div key={index}>
                         {isObject ? (
                             <Collapsible defaultOpen={level < 2}>
                                 <CollapsibleTrigger className='flex items-center gap-1 text-accent font-semibold text-sm group'>
                                     <ChevronRight className='h-4 w-4 transition-transform group-data-[state=open]:rotate-90' />
                                     Item {index + 1}
                                 </CollapsibleTrigger>
                                 <CollapsibleContent className='pt-2'>
                                     <Card className='bg-muted/40 border-border'>
                                         <CardContent className='p-3'>
                                             <JsonObject data={item} level={level + 1} />
                                         </CardContent>
                                     </Card>
                                 </CollapsibleContent>
                             </Collapsible>
                         ) : (
                             <div className='text-sm text-foreground'>{item}</div>
                         )}
                    </div>
                 )
            })}
        </div>
    );
}

export function JsonViewer({ data, title }: JsonViewerProps) {
  return (
    <Card className='border-border shadow-none'>
      <CardHeader>
        <CardTitle>{title || 'Visualizador de Dados'}</CardTitle>
        <CardDescription>Inspecione a estrutura de dados abaixo.</CardDescription>
      </CardHeader>
      <CardContent>
        <JsonObject data={data} level={0} />
      </CardContent>
    </Card>
  );
}
