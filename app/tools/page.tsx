//tools 페이지
import { getToolsByCategory } from '@/models/data/tools';
import { ToolCard } from '@/components/common/ToolCard';

export default function ToolsPage(){
    const tools = getToolsByCategory('tools');

     return (
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-2">온라인 도구</h1>
        <p className="text-gray-600 mb-8">이미지, QR코드, PDF 등 다양한 도구</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    );
  }