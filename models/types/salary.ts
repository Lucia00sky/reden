//연봉 계산기 타입 정의

//
export interface SalaryInput {
    annualSalary: number; //연봉
    includeSeverance : boolean; //퇴직금 포함 여부
    nonTaxable: number; //비과세액
    dependents: number; //부양가족 수
    childrenUnder20: number; //20세 미만 자녀 수
}

//공제내역
export interface Deductions{
    nationalPension: number; //국민연금
    healthInsurance: number; //건강보험
    longTermCareInsurance: number; //장기요양보험
    employmentInsurance: number; //고용보험
    incomeTax: number; //소득세
    localIncomeTax: number; //지방소득세
    totalDeductions: number; //총 공제액
}

//계산결과
export interface SalaryResult {
    monthlySalary: number; //월급여 (세전)
    deductions: Deductions; //공제 내역
    netSalary: number; //월 실수령액
    annualNetSalary: number; //연간 실수령액
    effectiveTaxRate: number; //실효세율
}

//전체상태
export interface SalaryCalculatorState {
    mode: 'basic' | 'compare' | 'reverse'; //계산 모드
    inputA: SalaryInput; //입력 A
    inputB: SalaryInput; //입력 B (비교모드용)
    resultA: SalaryResult | null; //결과 A
    resultB: SalaryResult | null; //결과 B (비교모드용)

    targetNetSalary: number; //역계산용 - 원하는 실수령액 (숫자)
    calculatedAnnualSalary: number | null; //역계산 결과 - 필요한 연봉 (숫자 또는 null)

    error: string | null; //오류 메시지
}