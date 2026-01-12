// 역계산 입력 카드 컴포넌트
'use client';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface SalaryReverseCardProps {
  targetNetSalary: number;
  calculatedAnnualSalary: number | null;
  onTargetChange: (value: number) => void;
}

export function SalaryReverseCard({
  targetNetSalary,
  calculatedAnnualSalary,
  onTargetChange,
}: SalaryReverseCardProps) {
  // 숫자 포맷팅
  const formatNumber = (num: number) => {
    return num.toLocaleString('ko-KR');
  };

  // 입력값에서 숫자만 추출
  const parseNumber = (value: string) => {
    return parseInt(value.replace(/,/g, ''), 10) || 0;
  };

  return (
    <Card className="p-6 space-y-4">
      <h3 className="font-semibold text-lg">원하는 실수령액</h3>
      <p className="text-sm text-gray-500">
        받고 싶은 월 실수령액을 입력하면 필요한 연봉을 계산합니다.
      </p>

      {/* 원하는 실수령액 입력 */}
      <div>
        <label className="block text-sm font-medium mb-2">
          월 실수령액 (원)
        </label>
        <Input
          type="text"
          value={targetNetSalary > 0 ? formatNumber(targetNetSalary) : ''}
          onChange={(e) => onTargetChange(parseNumber(e.target.value))}
          placeholder="예: 3,000,000"
          className="text-right text-lg"
        />
        {/* 빠른 입력 버튼 */}
        <div className="flex flex-wrap gap-2 mt-2">
          {[200, 250, 300, 350, 400, 500].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => onTargetChange(val * 10000)}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
            >
              {val}만
            </button>
          ))}
        </div>
      </div>

      {/* 계산 결과 */}
      {calculatedAnnualSalary !== null && (
        <div className="bg-blue-50 p-4 rounded-lg mt-4">
          <div className="text-sm text-gray-600">필요한 연봉</div>
          <div className="text-3xl font-bold text-blue-700">
            {formatNumber(calculatedAnnualSalary)}원
          </div>
          <div className="text-sm text-gray-500 mt-1">
            (약 {Math.round(calculatedAnnualSalary / 10000).toLocaleString()}만원)
          </div>
        </div>
      )}
    </Card>
  );
}
