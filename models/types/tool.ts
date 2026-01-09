export interface Tool {
   id: string;
   title: string;
   description: string;
   href: string;
   icon: string;
   category: 'tools' | 'dev' | 'calc';
   isReady: boolean;  // 구현 완료 여부
}