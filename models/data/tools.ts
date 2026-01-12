import {Tool} from '@/models/types/tool';

//온라인 도구
export const toolsList: Tool[] = [
    {
      id: 'qr',
      title: 'QR코드 생성기',
      description: 'URL, 텍스트를 QR코드로 변환',
      href: '/tools/qr',
      icon: '📱',
      category: 'tools',
      isReady: true,
    },
    {
      id: 'image-resize',
      title: '이미지 리사이즈',
      description: '이미지 크기 조절',
      href: '/tools/image',
      icon: '🖼️',
      category: 'tools',
      isReady: true,
    },
    {
      id: 'image-compress',
      title: '이미지 압축',
      description: '이미지 용량 줄이기',
      href: '/tools/image-compress',
      icon: '📦',
      category: 'tools',
      isReady: false,
    },
    {
      id: 'barcode',
      title: '바코드 생성기',
      description: '상품 바코드 생성',
      href: '/tools/barcode',
      icon: '🏷️',
      category: 'tools',
      isReady: false,
    },

    // 개발자 도구
    {
      id: 'json',
      title: 'JSON 포맷터',
      description: 'JSON 정렬 및 검증',
      href: '/dev/json',
      icon: '{ }',
      category: 'dev',
      isReady: false,
    },
    {
      id: 'base64',
      title: 'Base64 변환',
      description: '인코딩/디코딩',
      href: '/dev/base64',
      icon: '🔐',
      category: 'dev',
      isReady: false,
    },

    // 계산기
    {
      id: 'salary',
      title: '연봉 실수령액',
      description: '4대보험, 세금 공제 후 실수령액',
      href: '/calc/salary',
      icon: '💰',
      category: 'calc',
      isReady: true,
    },
    {
      id: 'calculator',
      title: '환율 계산기',
      description: '실시간 환율 계산',
      href: '/calc/exchange',
      icon: '💱',
      category: 'calc',
      isReady: false,
    },
];

export const getToolsByCategory = (category: Tool['category']) => {
    return toolsList.filter((tool) => tool.category === category);
  };