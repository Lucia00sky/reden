 'use client';

  import { useState, useCallback } from 'react';
  import {
    SalaryInput,
    Deductions,
    SalaryResult,
    SalaryCalculatorState,
  } from '@/models/types/salary';

  // ========================================
  // 2025년 기준 세율 상수
  // ========================================
  const TAX_RATES = {
    nationalPension: 0.045,           // 국민연금 4.5%
    nationalPensionMax: 270000,       // 국민연금 상한액 (월)
    healthInsurance: 0.03545,         // 건강보험 3.545%
    longTermCareRate: 0.1295,         // 장기요양 (건강보험의 12.95%)
    employmentInsurance: 0.009,       // 고용보험 0.9%
  };

  // 소득세 과세표준 구간 (연간)
  const INCOME_TAX_BRACKETS = [
    { limit: 14000000, rate: 0.06, deduction: 0 },
    { limit: 50000000, rate: 0.15, deduction: 1260000 },
    { limit: 88000000, rate: 0.24, deduction: 5760000 },
    { limit: 150000000, rate: 0.35, deduction: 15440000 },
    { limit: 300000000, rate: 0.38, deduction: 19940000 },
    { limit: 500000000, rate: 0.40, deduction: 25940000 },
    { limit: 1000000000, rate: 0.42, deduction: 35940000 },
    { limit: Infinity, rate: 0.45, deduction: 65940000 },
  ];

  // ========================================
  // 초기값
  // ========================================
  const initialInput: SalaryInput = {
    annualSalary: 0,
    includeSeverance: false,
    nonTaxable: 0,
    dependents: 1,
    childrenUnder20: 0,
  };

  const initialState: SalaryCalculatorState = {
    mode: 'basic',
    inputA: { ...initialInput },
    inputB: { ...initialInput },
    resultA: null,
    resultB: null,
    targetNetSalary: 0,
    calculatedAnnualSalary: null,
    error: null,
  };

  // ========================================
  // 메인 훅
  // ========================================
  export function useSalaryCalculator() {
    const [state, setState] = useState<SalaryCalculatorState>(initialState);

    // ----------------------------------------
    // 모드 변경
    // ----------------------------------------
    const setMode = useCallback((mode: 'basic' | 'compare' | 'reverse') => {
      setState(prev => ({
        ...prev,
        mode,
        resultA: null,
        resultB: null,
        calculatedAnnualSalary: null,
        error: null,
      }));
    }, []);

    // ----------------------------------------
    // 입력값 변경 함수들
    // ----------------------------------------
    const updateInput = useCallback((
      target: 'A' | 'B',
      field: keyof SalaryInput,
      value: number | boolean
    ) => {
      setState(prev => ({
        ...prev,
        [target === 'A' ? 'inputA' : 'inputB']: {
          ...prev[target === 'A' ? 'inputA' : 'inputB'],
          [field]: value,
        },
        error: null,
      }));
    }, []);

    const setAnnualSalaryA = useCallback((salary: number) => {
      updateInput('A', 'annualSalary', salary);
    }, [updateInput]);

    const setAnnualSalaryB = useCallback((salary: number) => {
      updateInput('B', 'annualSalary', salary);
    }, [updateInput]);

    const setIncludeSeverance = useCallback((include: boolean, target: 'A' | 'B' = 'A') => {
      updateInput(target, 'includeSeverance', include);
    }, [updateInput]);

    const setNonTaxable = useCallback((amount: number, target: 'A' | 'B' = 'A') => {
      updateInput(target, 'nonTaxable', amount);
    }, [updateInput]);

    const setDependents = useCallback((count: number, target: 'A' | 'B' = 'A') => {
      updateInput(target, 'dependents', Math.max(1, count));
    }, [updateInput]);

    const setChildrenUnder20 = useCallback((count: number, target: 'A' | 'B' = 'A') => {
      updateInput(target, 'childrenUnder20', Math.max(0, count));
    }, [updateInput]);

    const setTargetNetSalary = useCallback((salary: number) => {
      setState(prev => ({ ...prev, targetNetSalary: salary, error: null }));
    }, []);

    // ----------------------------------------
    // 국민연금 계산
    // ----------------------------------------
    const calculateNationalPension = (monthlySalary: number): number => {
      const pension = monthlySalary * TAX_RATES.nationalPension;
      return Math.min(pension, TAX_RATES.nationalPensionMax);
    };

    // ----------------------------------------
    // 건강보험 계산
    // ----------------------------------------
    const calculateHealthInsurance = (monthlySalary: number): number => {
      return monthlySalary * TAX_RATES.healthInsurance;
    };

    // ----------------------------------------
    // 장기요양보험 계산
    // ----------------------------------------
    const calculateLongTermCare = (healthInsurance: number): number => {
      return healthInsurance * TAX_RATES.longTermCareRate;
    };

    // ----------------------------------------
    // 고용보험 계산
    // ----------------------------------------
    const calculateEmploymentInsurance = (monthlySalary: number): number => {
      return monthlySalary * TAX_RATES.employmentInsurance;
    };

    // ----------------------------------------
    // 소득세 계산 (핵심!)
    // ----------------------------------------
    const calculateIncomeTax = (
      annualSalary: number,
      dependents: number,
      children: number
    ): number => {
      // 1. 근로소득공제 계산
      let incomeDeduction = 0;
      if (annualSalary <= 5000000) {
        incomeDeduction = annualSalary * 0.7;
      } else if (annualSalary <= 15000000) {
        incomeDeduction = 3500000 + (annualSalary - 5000000) * 0.4;
      } else if (annualSalary <= 45000000) {
        incomeDeduction = 7500000 + (annualSalary - 15000000) * 0.15;
      } else if (annualSalary <= 100000000) {
        incomeDeduction = 12000000 + (annualSalary - 45000000) * 0.05;
      } else {
        incomeDeduction = 14750000 + (annualSalary - 100000000) * 0.02;
      }

      // 2. 인적공제 (1인당 150만원)
      const personalDeduction = dependents * 1500000;

      // 3. 자녀세액공제 (자녀 1인당 15만원, 2명 이상이면 추가)
      let childTaxCredit = 0;
      if (children === 1) {
        childTaxCredit = 150000;
      } else if (children === 2) {
        childTaxCredit = 350000;
      } else if (children >= 3) {
        childTaxCredit = 350000 + (children - 2) * 300000;
      }

      // 4. 과세표준 계산
      const taxableIncome = Math.max(0, annualSalary - incomeDeduction - personalDeduction);

      // 5. 세율 적용
      let annualTax = 0;
      for (const bracket of INCOME_TAX_BRACKETS) {
        if (taxableIncome <= bracket.limit) {
          annualTax = taxableIncome * bracket.rate - bracket.deduction;
          break;
        }
      }

      // 6. 자녀세액공제 적용
      annualTax = Math.max(0, annualTax - childTaxCredit);

      // 7. 월 소득세 반환
      return Math.max(0, annualTax / 12);
    };

    // ----------------------------------------
    // 지방소득세 계산
    // ----------------------------------------
    const calculateLocalIncomeTax = (incomeTax: number): number => {
      return incomeTax * 0.1;
    };

    // ----------------------------------------
    // 전체 계산 함수
    // ----------------------------------------
    const calculateSalary = (input: SalaryInput): SalaryResult => {
      let annualSalary = input.annualSalary;

      // 퇴직금 포함이면 실제 연봉은 12/13
      if (input.includeSeverance) {
        annualSalary = annualSalary * (12 / 13);
      }

      // 월급 계산
      const monthlySalary = annualSalary / 12;

      // 과세 대상 금액 (비과세 제외)
      const taxableSalary = Math.max(0, monthlySalary - input.nonTaxable);

      // 4대보험 계산
      const nationalPension = calculateNationalPension(taxableSalary);
      const healthInsurance = calculateHealthInsurance(taxableSalary);
      const longTermCare = calculateLongTermCare(healthInsurance);
      const employmentInsurance = calculateEmploymentInsurance(taxableSalary);

      // 소득세 계산 (비과세 제외한 연봉 기준)
      const taxableAnnual = annualSalary - (input.nonTaxable * 12);
      const incomeTax = calculateIncomeTax(
        taxableAnnual,
        input.dependents,
        input.childrenUnder20
      );
      const localIncomeTax = calculateLocalIncomeTax(incomeTax);

      // 총 공제액
      const totalDeductions =
        nationalPension +
        healthInsurance +
        longTermCare +
        employmentInsurance +
        incomeTax +
        localIncomeTax;

      // 실수령액
      const netSalary = monthlySalary - totalDeductions;
      const annualNetSalary = netSalary * 12;

      // 실효세율
      const effectiveTaxRate = monthlySalary > 0
        ? (totalDeductions / monthlySalary) * 100
        : 0;

      return {
        monthlySalary: Math.round(monthlySalary),
        deductions: {
          nationalPension: Math.round(nationalPension),
          healthInsurance: Math.round(healthInsurance),
          longTermCareInsurance: Math.round(longTermCare),
          employmentInsurance: Math.round(employmentInsurance),
          incomeTax: Math.round(incomeTax),
          localIncomeTax: Math.round(localIncomeTax),
          totalDeductions: Math.round(totalDeductions),
        },
        netSalary: Math.round(netSalary),
        annualNetSalary: Math.round(annualNetSalary),
        effectiveTaxRate: Math.round(effectiveTaxRate * 100) / 100,
      };
    };

    // ----------------------------------------
    // 기본/비교 계산 실행
    // ----------------------------------------
    const calculate = useCallback(() => {
      if (state.inputA.annualSalary <= 0) {
        setState(prev => ({ ...prev, error: '연봉을 입력해주세요.' }));
        return;
      }

      const resultA = calculateSalary(state.inputA);
      let resultB: SalaryResult | null = null;

      if (state.mode === 'compare') {
        if (state.inputB.annualSalary <= 0) {
          setState(prev => ({ ...prev, error: '비교할 연봉을 입력해주세요.' }));
          return;
        }
        resultB = calculateSalary(state.inputB);
      }

      setState(prev => ({
        ...prev,
        resultA,
        resultB,
        error: null,
      }));
    }, [state.inputA, state.inputB, state.mode]);

    // ----------------------------------------
    // 역계산 (원하는 실수령액 → 필요한 연봉)
    // ----------------------------------------
    const calculateReverse = useCallback(() => {
      if (state.targetNetSalary <= 0) {
        setState(prev => ({ ...prev, error: '원하는 실수령액을 입력해주세요.' }));
        return;
      }

      const targetMonthly = state.targetNetSalary;

      // 이진 탐색으로 연봉 찾기
      let low = targetMonthly * 12;
      let high = targetMonthly * 12 * 3;
      let result = 0;

      for (let i = 0; i < 50; i++) {
        const mid = Math.floor((low + high) / 2);
        const testInput: SalaryInput = {
          ...state.inputA,
          annualSalary: mid,
        };
        const testResult = calculateSalary(testInput);

        if (Math.abs(testResult.netSalary - targetMonthly) < 1000) {
          result = mid;
          break;
        }

        if (testResult.netSalary < targetMonthly) {
          low = mid;
        } else {
          high = mid;
        }
        result = mid;
      }

      // 결과도 같이 계산
      const finalInput: SalaryInput = {
        ...state.inputA,
        annualSalary: result,
      };
      const resultA = calculateSalary(finalInput);

      setState(prev => ({
        ...prev,
        calculatedAnnualSalary: result,
        resultA,
        error: null,
      }));
    }, [state.targetNetSalary, state.inputA]);

    // ----------------------------------------
    // 시급 환산
    // ----------------------------------------
    const calculateHourlyRate = useCallback((
      monthlyNet: number,
      hoursPerWeek: number = 40
    ): number => {
      const monthlyHours = hoursPerWeek * 4.345; // 평균 주 수
      return Math.round(monthlyNet / monthlyHours);
    }, []);

    // ----------------------------------------
    // 초기화
    // ----------------------------------------
    const clear = useCallback(() => {
      setState(initialState);
    }, []);

    return {
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
      calculateHourlyRate,
      clear,
    };
  }