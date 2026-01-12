// 계산 결과 카드 컴포넌트
'use client';

import { Card } from '@/components/ui/card';
import { SalaryResult } from '@/models/types/salary';

interface SalaryResultCardProps {
  title: string;
  result: SalaryResult;
  compareResult?: SalaryResult | null;
}

export function SalaryResultCard({ title, result, compareResult }: SalaryResultCardProps) {
  // 숫자 포맷팅
  const formatMoney = (num: number) => {
    return num.toLocaleString('ko-KR') + '원';
  };

  // 비교 시 차이 표시
  const getDiff = (a: number, b: number) => {
    const diff = a - b;
    if (diff === 0) return null;
    const sign = diff > 0 ? '+' : '';
    return (
      <span className={diff > 0 ? 'text-green-600' : 'text-red-600'}>
        ({sign}{formatMoney(diff)})
      </span>
    );
  };

  return (
    <Card className="p-6 space-y-4">
      <h3 className="font-semibold text-lg border-b pb-2">{title}</h3>

      {/* 핵심 결과 */}
      <div className="bg-green-50 p-4 rounded-lg">
        <div className="text-sm text-gray-600">월 실수령액</div>
        <div className="text-3xl font-bold text-green-700">
          {formatMoney(result.netSalary)}
        </div>
        {compareResult && getDiff(result.netSalary, compareResult.netSalary)}
      </div>

      {/* 세전 월급 */}
      <div className="flex justify-between py-2 border-b">
        <span className="text-gray-600">세전 월급</span>
        <span className="font-medium">{formatMoney(result.monthlySalary)}</span>
      </div>

      {/* 공제 내역 */}
      <div className="space-y-2">
        <div className="font-medium text-gray-700">공제 내역</div>

        <div className="text-sm space-y-1 pl-2">
          <div className="flex justify-between">
            <span className="text-gray-500">국민연금</span>
            <span>{formatMoney(result.deductions.nationalPension)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">건강보험</span>
            <span>{formatMoney(result.deductions.healthInsurance)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">장기요양보험</span>
            <span>{formatMoney(result.deductions.longTermCareInsurance)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">고용보험</span>
            <span>{formatMoney(result.deductions.employmentInsurance)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">소득세</span>
            <span>{formatMoney(result.deductions.incomeTax)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">지방소득세</span>
            <span>{formatMoney(result.deductions.localIncomeTax)}</span>
          </div>
        </div>

        <div className="flex justify-between pt-2 border-t font-medium">
          <span className="text-red-600">총 공제액</span>
          <span className="text-red-600">{formatMoney(result.deductions.totalDeductions)}</span>
        </div>
      </div>

      {/* 연간 실수령액 */}
      <div className="flex justify-between py-2 border-t">
        <span className="text-gray-600">연간 실수령액</span>
        <span className="font-medium">{formatMoney(result.annualNetSalary)}</span>
      </div>

      {/* 실효세율 */}
      <div className="flex justify-between py-2 border-t">
        <span className="text-gray-600">실효세율</span>
        <span className="font-medium">{result.effectiveTaxRate}%</span>
      </div>
    </Card>
  );
}
