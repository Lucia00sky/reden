// 연봉 실수령액 계산기 페이지
'use client';

import { Button } from '@/components/ui/button';
import { SalaryModeSelector } from '@/components/calc/salary/SalaryModeSelector';
import { SalaryInputCard } from '@/components/calc/salary/SalaryInputCard';
import { SalaryResultCard } from '@/components/calc/salary/SalaryResultCard';
import { SalaryReverseCard } from '@/components/calc/salary/SalaryReverseCard';
import { useSalaryCalculator } from '@/viewmodels/useSalaryCaculator';

export default function SalaryCalculatorPage() {
  const {
    state,
    setMode,
    setAnnualSalaryA,
    setAnnualSalaryB,
    setIncludeSeverance,
    setNonTaxable,
    setDependents,
    setChildrenUnder20,
    setTargetNetSalary,
    calculate,
    calculateReverse,
    clear,
  } = useSalaryCalculator();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">연봉 실수령액 계산기</h1>
        <p className="text-gray-600">
          2025년 기준 4대보험, 소득세를 반영한 정확한 실수령액 계산
        </p>
      </div>

      {/* 모드 선택 */}
      <div className="mb-6">
        <SalaryModeSelector mode={state.mode} onModeChange={setMode} />
      </div>

      {/* 에러 메시지 */}
      {state.error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-center">
          {state.error}
        </div>
      )}

      {/* 기본/비교 모드 */}
      {state.mode !== 'reverse' && (
        <>
          <div className={`grid gap-6 mb-6 ${state.mode === 'compare' ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
            {/* 입력 A */}
            <SalaryInputCard
              title={state.mode === 'compare' ? '연봉 A' : '연봉 정보'}
              input={state.inputA}
              onAnnualSalaryChange={setAnnualSalaryA}
              onIncludeSeveranceChange={(v) => setIncludeSeverance(v, 'A')}
              onNonTaxableChange={(v) => setNonTaxable(v, 'A')}
              onDependentsChange={(v) => setDependents(v, 'A')}
              onChildrenChange={(v) => setChildrenUnder20(v, 'A')}
            />

            {/* 입력 B (비교 모드) */}
            {state.mode === 'compare' && (
              <SalaryInputCard
                title="연봉 B"
                input={state.inputB}
                onAnnualSalaryChange={setAnnualSalaryB}
                onIncludeSeveranceChange={(v) => setIncludeSeverance(v, 'B')}
                onNonTaxableChange={(v) => setNonTaxable(v, 'B')}
                onDependentsChange={(v) => setDependents(v, 'B')}
                onChildrenChange={(v) => setChildrenUnder20(v, 'B')}
              />
            )}
          </div>

          {/* 계산 버튼 */}
          <div className="flex gap-4 justify-center mb-6">
            <Button onClick={calculate} size="lg" className="px-8">
              계산하기
            </Button>
            <Button onClick={clear} variant="outline" size="lg">
              초기화
            </Button>
          </div>

          {/* 결과 */}
          {state.resultA && (
            <div className={`grid gap-6 ${state.mode === 'compare' && state.resultB ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
              <SalaryResultCard
                title={state.mode === 'compare' ? '결과 A' : '계산 결과'}
                result={state.resultA}
                compareResult={state.resultB}
              />
              {state.mode === 'compare' && state.resultB && (
                <SalaryResultCard
                  title="결과 B"
                  result={state.resultB}
                  compareResult={state.resultA}
                />
              )}
            </div>
          )}
        </>
      )}

      {/* 역계산 모드 */}
      {state.mode === 'reverse' && (
        <>
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            {/* 역계산 입력 */}
            <SalaryReverseCard
              targetNetSalary={state.targetNetSalary}
              calculatedAnnualSalary={state.calculatedAnnualSalary}
              onTargetChange={setTargetNetSalary}
            />

            {/* 기타 조건 */}
            <SalaryInputCard
              title="계산 조건"
              input={state.inputA}
              onAnnualSalaryChange={() => {}} // 역계산에서는 연봉 입력 불필요
              onIncludeSeveranceChange={(v) => setIncludeSeverance(v, 'A')}
              onNonTaxableChange={(v) => setNonTaxable(v, 'A')}
              onDependentsChange={(v) => setDependents(v, 'A')}
              onChildrenChange={(v) => setChildrenUnder20(v, 'A')}
            />
          </div>

          {/* 계산 버튼 */}
          <div className="flex gap-4 justify-center mb-6">
            <Button onClick={calculateReverse} size="lg" className="px-8">
              역계산하기
            </Button>
            <Button onClick={clear} variant="outline" size="lg">
              초기화
            </Button>
          </div>

          {/* 역계산 결과 */}
          {state.resultA && state.calculatedAnnualSalary && (
            <SalaryResultCard
              title="상세 결과"
              result={state.resultA}
            />
          )}
        </>
      )}

      {/* 안내 문구 */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
        <p className="font-medium mb-2">참고사항</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>2025년 4대보험 요율 기준으로 계산됩니다.</li>
          <li>실제 급여와 차이가 있을 수 있습니다. (상여금, 수당 등)</li>
          <li>국민연금은 월 상한액 270,000원이 적용됩니다.</li>
          <li>간이세액표 기준이며, 연말정산 시 변동될 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
}
