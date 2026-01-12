// 연봉 입력 카드 컴포넌트
'use client';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { SalaryInput } from '@/models/types/salary';

interface SalaryInputCardProps {
  title: string;
  input: SalaryInput;
  onAnnualSalaryChange: (value: number) => void;
  onIncludeSeveranceChange: (value: boolean) => void;
  onNonTaxableChange: (value: number) => void;
  onDependentsChange: (value: number) => void;
  onChildrenChange: (value: number) => void;
}

export function SalaryInputCard({
  title,
  input,
  onAnnualSalaryChange,
  onIncludeSeveranceChange,
  onNonTaxableChange,
  onDependentsChange,
  onChildrenChange,
}: SalaryInputCardProps) {
  // 숫자 포맷팅 (콤마 추가)
  const formatNumber = (num: number) => {
    return num.toLocaleString('ko-KR');
  };

  // 입력값에서 숫자만 추출
  const parseNumber = (value: string) => {
    return parseInt(value.replace(/,/g, ''), 10) || 0;
  };

  return (
    <Card className="p-6 space-y-4">
      <h3 className="font-semibold text-lg">{title}</h3>

      {/* 연봉 입력 */}
      <div>
        <label className="block text-sm font-medium mb-2">연봉 (원)</label>
        <Input
          type="text"
          value={input.annualSalary > 0 ? formatNumber(input.annualSalary) : ''}
          onChange={(e) => onAnnualSalaryChange(parseNumber(e.target.value))}
          placeholder="예: 50,000,000"
          className="text-right"
        />
        {/* 빠른 입력 버튼 */}
        <div className="flex flex-wrap gap-2 mt-2">
          {[3000, 4000, 5000, 6000, 8000, 10000].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => onAnnualSalaryChange(val * 10000)}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
            >
              {val >= 10000 ? `${val / 10000}억` : `${val}만`}
            </button>
          ))}
        </div>
      </div>

      {/* 퇴직금 포함 여부 */}
      <div className="flex items-center gap-2">
        <Checkbox
          id={`severance-${title}`}
          checked={input.includeSeverance}
          onCheckedChange={(checked: boolean) => onIncludeSeveranceChange(checked)}
        />
        <label htmlFor={`severance-${title}`} className="text-sm">
          퇴직금 포함 (연봉의 1/13)
        </label>
      </div>

      {/* 비과세액 */}
      <div>
        <label className="block text-sm font-medium mb-2">
          비과세액 (월, 식대 등)
        </label>
        <Input
          type="text"
          value={input.nonTaxable > 0 ? formatNumber(input.nonTaxable) : ''}
          onChange={(e) => onNonTaxableChange(parseNumber(e.target.value))}
          placeholder="예: 200,000"
          className="text-right"
        />
        <div className="flex gap-2 mt-2">
          {[0, 100000, 200000].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => onNonTaxableChange(val)}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
            >
              {val === 0 ? '없음' : `${val / 10000}만`}
            </button>
          ))}
        </div>
      </div>

      {/* 부양가족 수 */}
      <div>
        <label className="block text-sm font-medium mb-2">
          부양가족 수 (본인 포함)
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onDependentsChange(Math.max(1, input.dependents - 1))}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded"
          >
            -
          </button>
          <Input
            type="number"
            value={input.dependents}
            onChange={(e) => onDependentsChange(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 text-center"
            min={1}
          />
          <button
            type="button"
            onClick={() => onDependentsChange(input.dependents + 1)}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded"
          >
            +
          </button>
          <span className="text-sm text-gray-500">명</span>
        </div>
      </div>

      {/* 20세 미만 자녀 수 */}
      <div>
        <label className="block text-sm font-medium mb-2">
          20세 미만 자녀 수
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChildrenChange(Math.max(0, input.childrenUnder20 - 1))}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded"
          >
            -
          </button>
          <Input
            type="number"
            value={input.childrenUnder20}
            onChange={(e) => onChildrenChange(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-16 text-center"
            min={0}
          />
          <button
            type="button"
            onClick={() => onChildrenChange(input.childrenUnder20 + 1)}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded"
          >
            +
          </button>
          <span className="text-sm text-gray-500">명</span>
        </div>
      </div>
    </Card>
  );
}
