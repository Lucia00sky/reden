import Link from 'next/link';
import {Card, CardContent} from '@/components/ui/card';
import {Tool} from '@/models/types/tool';

interface ToolCardProps{
    tool:Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
   if (!tool.isReady) {
     return (
       <Card className="opacity-50 cursor-not-allowed">
         <CardContent className="p-6">
           <div className="text-3xl mb-3">{tool.icon}</div>
           <h3 className="font-semibold mb-1">{tool.title}</h3>
           <p className="text-sm text-gray-500">{tool.description}</p>
           <span className="text-xs text-gray-400 mt-2 block">준비 중</span>
         </CardContent>
       </Card>
     );
   }

   return (
     <Link href={tool.href}>
       <Card className="hover:shadow-lg transition cursor-pointer h-full">
         <CardContent className="p-6">
           <div className="text-3xl mb-3">{tool.icon}</div>
           <h3 className="font-semibold mb-1">{tool.title}</h3>
           <p className="text-sm text-gray-500">{tool.description}</p>
         </CardContent>
       </Card>
     </Link>
   );
 }