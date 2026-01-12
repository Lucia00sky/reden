// 계산 모드 선택 컴포넌트
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface SalaryModeSelectorProps {
  mode: 'basic' | 'compare' | 'reverse';
  onModeChange: (mode: 'basic' | 'compare' | 'reverse') => void;
}

export function SalaryModeSelector({ mode, onModeChange }: SalaryModeSelectorProps) {
  const modes = [
    { value: 'basic' as const, label: '기본 계산', desc: '연봉 → 실수령액' },
    { value: 'compare' as const, label: '비교 계산', desc: '두 연봉 비교' },
    { value: 'reverse' as const, label: '역계산', desc: '실수령액 → 연봉' },
  ];

  return (
    <Card className="p-4">
      <div className="flex flex-wrap gap-2">
        {modes.map((m) => (
          <Button
            key={m.value}
            variant={mode === m.value ? 'default' : 'outline'}
            onClick={() => onModeChange(m.value)}
            className="flex-1 min-w-[100px]"
          >
            <div className="text-center">
              <div className="font-medium">{m.label}</div>
              <div className="text-xs opacity-70">{m.desc}</div>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
}
