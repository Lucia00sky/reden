# R:EDEN 프로젝트 - TypeScript & Next.js 입문 가이드

> 이 문서는 R:EDEN 프로젝트를 진행하면서 배운 내용을 정리한 교육 자료입니다.

---

## 목차
1. [TypeScript란?](#1-typescript란)
2. [.ts vs .tsx 파일](#2-ts-vs-tsx-파일)
3. [TypeScript 기본 문법](#3-typescript-기본-문법)
4. [React 기초](#4-react-기초)
5. [React 심화 - Hooks](#5-react-심화---hooks)
6. [Next.js 구조](#6-nextjs-구조)
7. [MVVM 패턴](#7-mvvm-패턴)
8. [실전 예제: QR코드 생성기](#8-실전-예제-qr코드-생성기)
9. [실전 예제: 이미지 변환기](#9-실전-예제-이미지-변환기)
10. [Canvas API 기초](#10-canvas-api-기초)
11. [파일 처리 패턴](#11-파일-처리-패턴)
12. [Tailwind CSS 기초](#12-tailwind-css-기초)
13. [자주 쓰는 패턴 모음](#13-자주-쓰는-패턴-모음)

---

## 1. TypeScript란?

### JavaScript vs TypeScript

```
TypeScript = JavaScript + 타입(Type)
```

| | JavaScript | TypeScript |
|--|-----------|------------|
| 타입 지정 | ❌ 없음 | ✅ 있음 |
| 에러 발견 | 실행할 때 | 코딩할 때 |
| 자동완성 | 약함 | 강력함 |
| 파일 확장자 | .js | .ts, .tsx |

### 왜 TypeScript를 쓸까?

```js
// JavaScript - 에러를 실행해야 발견
function add(a, b) {
  return a + b;
}
add("1", 2);  // "12" - 의도치 않은 결과, 실행해야 알 수 있음
```

```ts
// TypeScript - 코딩할 때 바로 에러 표시
function add(a: number, b: number): number {
  return a + b;
}
add("1", 2);  // ❌ 에러! string은 number에 할당할 수 없음
```

---

## 2. .ts vs .tsx 파일

### 확장자 구분

| 확장자 | 용도 | 특징 |
|--------|------|------|
| `.ts` | 순수 TypeScript | 로직, 타입, 유틸리티 |
| `.tsx` | TypeScript + JSX | UI 컴포넌트 (HTML 같은 문법 사용) |

### 예시

```ts
// models/types/qr.ts (순수 타입 정의 - .ts)
export interface QrGeneratorState {
  text: string;
  qrCodeUrl: string;
  error: string | null;
}
```

```tsx
// app/tools/qr/page.tsx (UI 컴포넌트 - .tsx)
export default function QrGeneratorPage() {
  return (
    <div>
      <h1>QR코드 생성기</h1>  {/* ← 이게 JSX (HTML 같은 문법) */}
    </div>
  );
}
```

### JSX란?

JavaScript 안에서 HTML처럼 UI를 작성하는 문법

```tsx
// JSX 예시
const element = <h1 className="title">안녕하세요</h1>;

// 실제로는 이렇게 변환됨
const element = React.createElement('h1', { className: 'title' }, '안녕하세요');
```

### JSX vs HTML 차이점

| HTML | JSX | 이유 |
|------|-----|------|
| `class` | `className` | class는 JavaScript 예약어 |
| `for` | `htmlFor` | for는 JavaScript 예약어 |
| `onclick` | `onClick` | camelCase 사용 |
| `style="color: red"` | `style={{ color: 'red' }}` | 객체로 전달 |

---

## 3. TypeScript 기본 문법

### 3.1 기본 타입

```ts
// 문자열
const name: string = "R:EDEN";
let title: string;  // 선언만 (나중에 할당)
title = "세상의 모든 도구";

// 숫자
const size: number = 300;
const pi: number = 3.14;
const hex: number = 0xff;  // 16진수도 가능

// 불리언 (참/거짓)
const isReady: boolean = true;
const isLoading: boolean = false;

// null과 undefined
const empty: null = null;
const notDefined: undefined = undefined;

// any (아무 타입이나 - 되도록 사용 X)
let anything: any = "문자열";
anything = 123;  // OK
anything = true;  // OK
```

### 3.2 배열 타입

```ts
// 방법 1: 타입[]
const numbers: number[] = [1, 2, 3, 4, 5];
const names: string[] = ["홍길동", "김철수"];

// 방법 2: Array<타입>
const scores: Array<number> = [100, 95, 88];

// 객체 배열
const tools: Tool[] = [
  { id: 'qr', title: 'QR코드 생성기' },
  { id: 'json', title: 'JSON 포맷터' },
];

// 빈 배열
const emptyList: string[] = [];
```

### 3.3 객체 타입

```ts
// 인라인 타입 정의
const user: { name: string; age: number } = {
  name: "홍길동",
  age: 25,
};

// 선택적 속성 (?)
const config: { url: string; timeout?: number } = {
  url: "https://api.com",
  // timeout은 없어도 OK
};
```

### 3.4 Interface (객체 타입 정의)

```ts
// 기본 interface
interface User {
  name: string;
  age: number;
}

// 선택적 속성 (?)
interface QrGeneratorState {
  text: string;
  qrCodeUrl: string;
  logo?: string;          // 있어도 되고 없어도 됨
  error: string | null;   // 있지만 null일 수 있음
}

// 읽기 전용 (readonly)
interface Config {
  readonly apiKey: string;  // 수정 불가
  timeout: number;
}

// 사용
const state: QrGeneratorState = {
  text: '',
  qrCodeUrl: '',
  // logo 생략 가능
  error: null,
};
```

### 3.5 Type Alias (타입 별칭)

```ts
// type으로 타입에 이름 붙이기
type ID = string;
type Coordinate = { x: number; y: number };

// interface와 비슷하지만 더 유연
type Category = 'tools' | 'dev' | 'calc';  // Union Type
type NumberOrString = number | string;

// 사용
const userId: ID = "user_123";
const point: Coordinate = { x: 10, y: 20 };
```

### 3.6 Union Type (여러 값 중 하나)

```ts
// 문자열 리터럴 Union
type Category = 'tools' | 'dev' | 'calc';
type ErrorLevel = 'L' | 'M' | 'Q' | 'H';
type Status = 'pending' | 'loading' | 'success' | 'error';

// 사용
const category: Category = 'tools';  // ✅ OK
const category: Category = 'other';  // ❌ 에러!

// 여러 타입 Union
type ID = string | number;
const userId: ID = "abc123";  // ✅ OK
const itemId: ID = 12345;     // ✅ OK

// null 허용
type MaybeString = string | null;
const error: MaybeString = null;
const message: MaybeString = "에러 발생!";
```

### 3.7 함수 타입

```ts
// 기본 함수
function add(a: number, b: number): number {
  return a + b;
}

// 화살표 함수
const multiply = (a: number, b: number): number => {
  return a * b;
};

// 한 줄이면 중괄호와 return 생략 가능
const multiply = (a: number, b: number): number => a * b;

// 반환값이 없는 함수
const log = (message: string): void => {
  console.log(message);
};

// 선택적 매개변수
const greet = (name: string, greeting?: string): string => {
  return `${greeting || '안녕하세요'}, ${name}님!`;
};
greet("홍길동");           // "안녕하세요, 홍길동님!"
greet("홍길동", "반갑습니다");  // "반갑습니다, 홍길동님!"

// 기본값 매개변수
const greet = (name: string, greeting: string = '안녕하세요'): string => {
  return `${greeting}, ${name}님!`;
};

// 비동기 함수
const fetchData = async (url: string): Promise<string> => {
  const response = await fetch(url);
  return response.text();
};

// 콜백 함수 타입
const process = (callback: (result: string) => void) => {
  callback("완료!");
};
```

### 3.8 제네릭 (Generic)

타입을 변수처럼 사용

```ts
// 기본 제네릭
function identity<T>(value: T): T {
  return value;
}
identity<string>("hello");  // 반환 타입: string
identity<number>(123);      // 반환 타입: number

// useState에서 사용
const [state, setState] = useState<QrGeneratorState>({...});
//                                 ^^^^^^^^^^^^^^^^
//                                 제네릭으로 타입 지정

// 배열
const tools: Array<Tool> = [];  // = Tool[]

// 여러 제네릭
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

const response: ApiResponse<User> = {
  data: { name: "홍길동", age: 25 },
  status: 200,
  message: "성공",
};
```

### 3.9 타입 단언 (Type Assertion)

```ts
// as 키워드로 타입 강제 지정
const input = document.getElementById('myInput') as HTMLInputElement;
input.value = "hello";

// 이벤트에서 자주 사용
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
};
```

### 3.10 export / import

```ts
// models/types/qr.ts
export interface QrGeneratorState {
  text: string;
}

export type ErrorLevel = 'L' | 'M' | 'Q' | 'H';

// 다른 파일에서 import
import { QrGeneratorState, ErrorLevel } from '@/models/types/qr';

// default export
export default function MyComponent() { }

// default import
import MyComponent from '@/components/MyComponent';
```

---

## 4. React 기초

### 4.1 컴포넌트란?

재사용 가능한 UI 조각

```tsx
// 함수형 컴포넌트 (권장)
function Button() {
  return <button>클릭하세요</button>;
}

// 화살표 함수로도 가능
const Button = () => {
  return <button>클릭하세요</button>;
};

// 사용
<Button />
<Button />  // 여러 번 재사용 가능
```

### 4.2 Props (속성 전달)

부모 → 자식으로 데이터 전달

```tsx
// Props 타입 정의
interface ButtonProps {
  text: string;
  color?: string;  // 선택적
  onClick: () => void;  // 함수도 전달 가능
}

// 자식 컴포넌트
function Button({ text, color = 'blue', onClick }: ButtonProps) {
  return (
    <button
      style={{ backgroundColor: color }}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

// 부모 컴포넌트
function Parent() {
  const handleClick = () => {
    alert('클릭됨!');
  };

  return (
    <div>
      <Button text="확인" onClick={handleClick} />
      <Button text="취소" color="red" onClick={handleClick} />
    </div>
  );
}
```

### 4.3 children Props

컴포넌트 사이에 넣은 내용 전달

```tsx
interface CardProps {
  children: React.ReactNode;  // 모든 JSX 가능
  title?: string;
}

function Card({ children, title }: CardProps) {
  return (
    <div className="card">
      {title && <h2>{title}</h2>}
      {children}
    </div>
  );
}

// 사용
<Card title="제목">
  <p>카드 내용입니다.</p>
  <button>버튼</button>
</Card>
```

### 4.4 useState (상태 관리)

컴포넌트 내부에서 변하는 값 관리

```tsx
import { useState } from 'react';

function Counter() {
  // [현재값, 값변경함수] = useState<타입>(초기값);
  const [count, setCount] = useState<number>(0);
  const [text, setText] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <p>카운트: {count}</p>

      {/* 직접 값 설정 */}
      <button onClick={() => setCount(10)}>10으로 설정</button>

      {/* 이전 값 기반으로 변경 */}
      <button onClick={() => setCount(prev => prev + 1)}>+1</button>
      <button onClick={() => setCount(prev => prev - 1)}>-1</button>

      {/* 토글 */}
      <button onClick={() => setIsOpen(prev => !prev)}>
        {isOpen ? '닫기' : '열기'}
      </button>
    </div>
  );
}
```

### 4.5 객체 상태 관리

```tsx
interface FormState {
  name: string;
  email: string;
  age: number;
}

function Form() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    age: 0,
  });

  // 특정 필드만 업데이트 (스프레드 연산자 사용)
  const updateName = (name: string) => {
    setForm({ ...form, name });
    // = setForm({ name: name, email: form.email, age: form.age });
  };

  // 동적으로 필드 업데이트
  const updateField = (field: keyof FormState, value: string | number) => {
    setForm({ ...form, [field]: value });
  };

  return (
    <div>
      <input
        value={form.name}
        onChange={(e) => updateName(e.target.value)}
      />
      <input
        value={form.email}
        onChange={(e) => updateField('email', e.target.value)}
      />
    </div>
  );
}
```

### 4.6 이벤트 처리

```tsx
function EventExamples() {
  // 클릭 이벤트
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('클릭됨');
    e.preventDefault();  // 기본 동작 방지
  };

  // input 변경 이벤트
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);  // 입력된 값
  };

  // textarea 변경 이벤트
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(e.target.value);
  };

  // select 변경 이벤트
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
  };

  // 키보드 이벤트
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('엔터 키 누름');
    }
    if (e.key === 'Escape') {
      console.log('ESC 키 누름');
    }
  };

  // 폼 제출 이벤트
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();  // 페이지 새로고침 방지
    console.log('폼 제출됨');
  };

  // 파일 선택 이벤트
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(file.name);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} onKeyDown={handleKeyDown} />
      <textarea onChange={handleTextareaChange} />
      <select onChange={handleSelectChange}>
        <option value="a">A</option>
        <option value="b">B</option>
      </select>
      <input type="file" onChange={handleFileChange} />
      <button type="submit" onClick={handleClick}>제출</button>
    </form>
  );
}
```

### 4.7 조건부 렌더링

```tsx
function ConditionalExamples({ isLoggedIn, user, items }: Props) {
  return (
    <div>
      {/* 방법 1: 삼항 연산자 */}
      {isLoggedIn ? <p>환영합니다!</p> : <p>로그인해주세요</p>}

      {/* 방법 2: && 연산자 (참일 때만 표시) */}
      {isLoggedIn && <p>로그인 상태입니다</p>}

      {/* 방법 3: || 연산자 (거짓일 때 대체값) */}
      <p>{user?.name || '익명 사용자'}</p>

      {/* 방법 4: 옵셔널 체이닝 (?.) */}
      <p>{user?.profile?.avatar}</p>

      {/* 방법 5: 널 병합 연산자 (??) */}
      <p>{user?.name ?? '기본 이름'}</p>

      {/* 방법 6: 조기 반환 */}
      {items.length === 0 && <p>항목이 없습니다</p>}
    </div>
  );
}

// 조기 반환 패턴
function UserProfile({ user }: { user: User | null }) {
  if (!user) {
    return <p>로딩 중...</p>;
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

### 4.8 리스트 렌더링

```tsx
interface Tool {
  id: string;
  title: string;
  description: string;
}

function ToolList({ tools }: { tools: Tool[] }) {
  return (
    <div>
      {/* 기본 map */}
      {tools.map((tool) => (
        <div key={tool.id}>  {/* key는 필수! 고유한 값 */}
          <h3>{tool.title}</h3>
          <p>{tool.description}</p>
        </div>
      ))}

      {/* 인덱스 사용 (비추천, 순서 변경 시 문제) */}
      {tools.map((tool, index) => (
        <div key={index}>{tool.title}</div>
      ))}

      {/* 컴포넌트로 분리 */}
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}

      {/* filter와 함께 사용 */}
      {tools
        .filter((tool) => tool.isReady)
        .map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
    </div>
  );
}
```

### 4.9 스프레드 연산자 (...)

```tsx
// 배열 스프레드
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];  // [1, 2, 3, 4, 5]

// 객체 스프레드
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 };  // { a: 1, b: 2, c: 3 }

// 상태 업데이트에서 많이 사용
const [state, setState] = useState({ name: '', age: 0 });
setState({ ...state, name: '홍길동' });
// = setState({ name: '홍길동', age: 0 });

// Props 전달에서 사용
const props = { title: '제목', description: '설명' };
<Card {...props} />
// = <Card title="제목" description="설명" />
```

---

## 5. React 심화 - Hooks

### 5.1 useCallback (함수 메모이제이션)

함수를 메모리에 저장해서 불필요한 재생성 방지

```tsx
import { useCallback } from 'react';

function ImageConverter() {
  const [state, setState] = useState({...});

  // ❌ 매번 새 함수 생성 (컴포넌트 렌더링마다)
  const setFormat = (format: string) => {
    setState(prev => ({ ...prev, format }));
  };

  // ✅ useCallback으로 감싸면 한 번만 생성
  const setFormat = useCallback((format: string) => {
    setState(prev => ({ ...prev, format }));
  }, []);  // 의존성 배열
}
```

#### 의존성 배열

```tsx
// 의존성 없음 - 함수가 한 번만 생성됨
const handleClick = useCallback(() => {
  console.log('클릭');
}, []);

// 의존성 있음 - originalSize가 바뀔 때만 함수 재생성
const setWidth = useCallback((width: number) => {
  const ratio = originalSize.height / originalSize.width;
  setState(prev => ({ ...prev, width, height: width * ratio }));
}, [originalSize]);
```

### 5.2 useRef (DOM 접근 & 값 유지)

```tsx
import { useRef } from 'react';

function FileUploader() {
  // DOM 요소 참조
  const inputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    // hidden input을 코드로 클릭
    inputRef.current?.click();
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />
      <button onClick={handleButtonClick}>파일 선택</button>
    </div>
  );
}
```

### 5.3 초기 상태 분리 패턴

```tsx
// ❌ 나쁜 예: 같은 값을 두 번 작성
const [state, setState] = useState({
  text: '',
  size: 300,
  error: null,
});

const clear = () => {
  setState({
    text: '',      // 중복!
    size: 300,     // 중복!
    error: null,   // 중복!
  });
};

// ✅ 좋은 예: 상수로 분리
const initialState = {
  text: '',
  size: 300,
  error: null,
};

const [state, setState] = useState(initialState);

const clear = () => {
  setState(initialState);  // 한 줄로 끝!
};
```

### 5.4 prev 패턴 (이전 상태 기반 업데이트)

```tsx
// ❌ 나쁜 예: 현재 state 직접 참조
const increment = () => {
  setState({ ...state, count: state.count + 1 });
  // 연속 호출 시 문제 발생 가능
};

// ✅ 좋은 예: prev 콜백 사용
const increment = () => {
  setState(prev => ({ ...prev, count: prev.count + 1 }));
  // 항상 최신 상태 기반으로 업데이트
};
```

---

## 6. Next.js 구조

### 5.1 App Router (폴더 = URL)

```
app/
├── page.tsx          → localhost:3000
├── tools/
│   ├── page.tsx      → localhost:3000/tools
│   └── qr/
│       └── page.tsx  → localhost:3000/tools/qr
├── dev/
│   └── page.tsx      → localhost:3000/dev
└── calc/
    └── page.tsx      → localhost:3000/calc
```

### 5.2 특수 파일들

| 파일명 | 역할 |
|--------|------|
| `page.tsx` | 해당 경로의 페이지 (필수) |
| `layout.tsx` | 공통 레이아웃 (헤더, 푸터) |
| `loading.tsx` | 로딩 화면 |
| `error.tsx` | 에러 화면 |
| `not-found.tsx` | 404 페이지 |
| `globals.css` | 전역 스타일 |

### 5.3 layout.tsx 상세

모든 페이지에 공통 적용되는 틀

```tsx
// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

// SEO 메타데이터
export const metadata: Metadata = {
  title: 'R:EDEN - 세상의 모든 도구',
  description: '일상, 개발, 업무에 필요한 모든 온라인 도구',
};

export default function RootLayout({
  children,  // 각 페이지 내용이 여기에 들어옴
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        {/* 모든 페이지에 표시되는 헤더 */}
        <header className="bg-green-600 text-white p-4">
          <nav className="max-w-6xl mx-auto">
            <Link href="/">R:EDEN</Link>
          </nav>
        </header>

        {/* 페이지별 내용 */}
        <main className="max-w-6xl mx-auto p-4">
          {children}
        </main>

        {/* 모든 페이지에 표시되는 푸터 */}
        <footer className="text-center p-4">
          © 2026 R:EDEN
        </footer>
      </body>
    </html>
  );
}
```

### 5.4 Client Component vs Server Component

```tsx
// Server Component (기본값)
// - 서버에서 렌더링
// - useState, useEffect, onClick 등 사용 불가
// - 데이터 fetching에 적합
export default function Page() {
  return <div>정적 콘텐츠</div>;
}

// Client Component
// - 브라우저에서 실행
// - useState, useEffect, onClick 등 사용 가능
// - 상호작용이 필요한 UI에 적합
'use client';  // ← 이 줄 필수! 파일 맨 위에

import { useState } from 'react';

export default function Page() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}
```

### 5.5 Link 컴포넌트

```tsx
import Link from 'next/link';

function Navigation() {
  return (
    <nav>
      {/* 기본 링크 */}
      <Link href="/">홈</Link>
      <Link href="/tools">도구</Link>
      <Link href="/tools/qr">QR생성기</Link>

      {/* 스타일 적용 */}
      <Link href="/about" className="text-blue-500 hover:underline">
        소개
      </Link>

      {/* 새 탭에서 열기 */}
      <Link href="https://google.com" target="_blank">
        구글
      </Link>
    </nav>
  );
}
```

### 5.6 경로 별칭 (@/)

```ts
// tsconfig.json에서 설정됨
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}

// 사용 예시
import { Tool } from '@/models/types/tool';
// 이것과 같음: import { Tool } from '../../models/types/tool';

import { useQrGenerator } from '@/viewmodels/useQrGenerator';
import { Button } from '@/components/ui/button';
```

---

## 7. MVVM 패턴

### 7.1 MVVM이란?

코드를 역할별로 분리하는 설계 패턴

```
Model ←→ ViewModel ←→ View
(데이터)    (로직)      (UI)
```

| 레이어 | 역할 | 우리 프로젝트 위치 |
|--------|------|-------------------|
| **Model** | 데이터 타입, API | `models/` |
| **ViewModel** | 상태 관리, 비즈니스 로직 | `viewmodels/` |
| **View** | UI 렌더링 | `app/`, `components/` |

### 7.2 왜 MVVM을 쓸까?

```
❌ 모든 코드가 한 파일에 → 유지보수 어려움

✅ MVVM으로 분리하면:
   - UI 바꿀 때 → View만 수정
   - 로직 바꿀 때 → ViewModel만 수정
   - 데이터 바꿀 때 → Model만 수정
```

### 7.3 React에서 MVVM 구현

```
View        = React 컴포넌트 (.tsx)
ViewModel   = Custom Hook (useXXX.ts)
Model       = Interface, 데이터 (.ts)
```

### 7.4 Custom Hook이란?

로직을 재사용 가능하게 분리한 함수 (use로 시작)

```ts
// viewmodels/useQrGenerator.ts
export function useQrGenerator() {
  const [state, setState] = useState<QrGeneratorState>({...});

  const setText = (text: string) => {...};
  const generate = async () => {...};
  const clear = () => {...};

  // 외부에서 사용할 것들만 반환
  return { state, setText, generate, clear };
}

// 컴포넌트에서 사용
function QrPage() {
  const { state, setText, generate } = useQrGenerator();
  // ...
}
```

---

## 8. 실전 예제: QR코드 생성기

### 8.1 전체 구조

```
models/
├── types/
│   └── qr.ts              ← Model (타입)

viewmodels/
└── useQrGenerator.ts      ← ViewModel (로직)

components/tools/qr/
├── QrSettingsCard.tsx     ← View (설정 UI)
├── QrResultCard.tsx       ← View (결과 UI)
├── ColorPicker.tsx        ← View (색상 선택)
└── RangeSlider.tsx        ← View (슬라이더)

app/tools/qr/
└── page.tsx               ← View (페이지)
```

### 8.2 Model - 타입 정의

```ts
// models/types/qr.ts
export interface QrGeneratorState {
  text: string;                      // 입력 텍스트
  qrCodeUrl: string;                 // 생성된 QR 이미지
  fgColor: string;                   // QR 색상
  bgColor: string;                   // 배경 색상
  size: number;                      // 크기 (100~500)
  logo: string | null;               // 로고 이미지 (선택)
  errorLevel: 'L' | 'M' | 'Q' | 'H'; // 에러 정정
  margin: number;                    // 여백
  error: string | null;              // 에러 메시지
}
```

### 8.3 ViewModel - 비즈니스 로직

```ts
// viewmodels/useQrGenerator.ts
import { useState } from 'react';
import QRCode from 'qrcode';
import { QrGeneratorState } from '@/models/types/qr';

export function useQrGenerator() {
  // 상태 정의
  const [state, setState] = useState<QrGeneratorState>({
    text: '',
    qrCodeUrl: '',
    fgColor: '#000000',
    bgColor: '#FFFFFF',
    size: 300,
    logo: null,
    errorLevel: 'M',
    margin: 2,
    error: null,
  });

  // 텍스트 변경
  const setText = (text: string) => {
    setState({ ...state, text, error: null });
  };

  // 색상 변경
  const setFgColor = (fgColor: string) => {
    setState({ ...state, fgColor });
  };

  const setBgColor = (bgColor: string) => {
    setState({ ...state, bgColor });
  };

  // QR코드 생성 (비동기)
  const generate = async () => {
    // 유효성 검사
    if (!state.text.trim()) {
      setState({ ...state, error: '텍스트를 입력해주세요' });
      return;
    }

    try {
      // QRCode 라이브러리로 이미지 생성
      const url = await QRCode.toDataURL(state.text, {
        width: state.size,
        margin: state.margin,
        errorCorrectionLevel: state.errorLevel,
        color: {
          dark: state.fgColor,
          light: state.bgColor,
        },
      });
      setState({ ...state, qrCodeUrl: url, error: null });
    } catch (e) {
      setState({ ...state, error: 'QR코드 생성에 실패했습니다' });
    }
  };

  // 다운로드
  const download = (format: 'png' | 'jpg') => {
    if (!state.qrCodeUrl) return;

    const link = document.createElement('a');
    link.download = `qrcode.${format}`;
    link.href = state.qrCodeUrl;
    link.click();
  };

  // 초기화
  const clear = () => {
    setState({
      text: '',
      qrCodeUrl: '',
      fgColor: '#000000',
      bgColor: '#FFFFFF',
      size: 300,
      logo: null,
      errorLevel: 'M',
      margin: 2,
      error: null,
    });
  };

  // View에서 사용할 것들 반환
  return {
    state,
    setText,
    setFgColor,
    setBgColor,
    generate,
    download,
    clear,
  };
}
```

### 8.4 View - 재사용 컴포넌트

```tsx
// components/tools/qr/ColorPicker.tsx
import { Input } from '@/components/ui/input';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div>
      <label className="text-sm font-medium mb-1 block">{label}</label>
      <div className="flex gap-2">
        {/* 색상 선택기 */}
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 rounded cursor-pointer"
        />
        {/* HEX 코드 직접 입력 */}
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
        />
      </div>
    </div>
  );
}
```

### 8.5 View - 페이지 조합

```tsx
// app/tools/qr/page.tsx
'use client';  // Client Component 선언

import { useQrGenerator } from '@/viewmodels/useQrGenerator';
import { QrSettingsCard } from '@/components/tools/qr/QrSettingsCard';
import { QrResultCard } from '@/components/tools/qr/QrResultCard';

export default function QrGeneratorPage() {
  // ViewModel에서 상태와 함수 가져오기
  const {
    state,
    setText,
    setFgColor,
    setBgColor,
    generate,
    download,
    clear,
  } = useQrGenerator();

  // UI 렌더링 (로직 없이 컴포넌트 조합만)
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6">QR코드 생성기</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <QrSettingsCard
          state={state}
          onTextChange={setText}
          onFgColorChange={setFgColor}
          onBgColorChange={setBgColor}
          onGenerate={generate}
          onClear={clear}
        />
        <QrResultCard
          qrCodeUrl={state.qrCodeUrl}
          onDownload={download}
        />
      </div>
    </div>
  );
}
```

### 8.6 데이터 흐름 정리

```
1. 사용자가 텍스트 입력
   ↓
2. View의 onChange → onTextChange 호출
   ↓
3. ViewModel의 setText 실행 → state 업데이트
   ↓
4. state가 바뀌면 React가 View를 자동으로 다시 렌더링

5. 사용자가 "생성" 버튼 클릭
   ↓
6. View의 onClick → onGenerate 호출
   ↓
7. ViewModel의 generate 실행 → QR코드 생성 → state.qrCodeUrl 업데이트
   ↓
8. View가 다시 렌더링 → QR코드 이미지 표시
```

---

## 9. 실전 예제: 이미지 변환기

### 9.1 전체 구조

```
models/
├── types/
│   └── image.ts              ← Model (타입)

viewmodels/
└── useImageConverter.ts      ← ViewModel (로직)

components/tools/image/
├── ImageUploader.tsx         ← View (업로드 UI)
├── ImageSettings.tsx         ← View (설정 UI)
├── ImagePreview.tsx          ← View (미리보기)
└── ImageActions.tsx          ← View (버튼)

app/tools/image/
└── page.tsx                  ← View (페이지)
```

### 9.2 Model - 타입 정의

```ts
// models/types/image.ts
export interface ImageConverterState {
  originalFile: File | null;       // 원본 파일
  originalUrl: string | null;      // 미리보기 URL
  resultUrl: string | null;        // 변환 결과 URL

  format: 'png' | 'jpeg' | 'webp'; // 출력 포맷
  quality: number;                 // 품질 (1~100)

  width: number;                   // 너비
  height: number;                  // 높이
  keepAspectRatio: boolean;        // 비율 유지

  rotation: 0 | 90 | 180 | 270;    // 회전
  flipHorizontal: boolean;         // 좌우 반전
  flipVertical: boolean;           // 상하 반전

  borderRadius: number;            // 둥근 모서리
  removeExif: boolean;             // EXIF 제거

  error: string | null;            // 에러 메시지
  isProcessing: boolean;           // 처리 중
}
```

### 9.3 ViewModel 핵심 로직

```ts
// viewmodels/useImageConverter.ts (핵심 부분)

// 초기 상태 분리 (재사용 가능)
const initialState: ImageConverterState = {
  originalFile: null,
  format: 'png',
  quality: 90,
  // ...
};

export function useImageConverter() {
  const [state, setState] = useState(initialState);
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });

  // 파일 업로드
  const setFile = useCallback((file: File) => {
    const url = URL.createObjectURL(file);  // 미리보기 URL 생성

    const img = new Image();
    img.onload = () => {
      setOriginalSize({ width: img.naturalWidth, height: img.naturalHeight });
      setState(prev => ({
        ...prev,
        originalFile: file,
        originalUrl: url,
        width: img.naturalWidth,
        height: img.naturalHeight,
      }));
    };
    img.src = url;
  }, []);

  // 이미지 변환 (Canvas 사용)
  const convert = useCallback(async () => {
    // ... Canvas로 이미지 변환 로직
  }, [state]);

  // 초기화
  const clear = useCallback(() => {
    if (state.originalUrl) {
      URL.revokeObjectURL(state.originalUrl);  // 메모리 정리
    }
    setState(initialState);
  }, [state.originalUrl]);

  return { state, setFile, convert, clear, /* ... */ };
}
```

---

## 10. Canvas API 기초

### 10.1 Canvas란?

HTML5에서 그래픽을 그리는 도구. 이미지 편집에 필수!

```tsx
// Canvas 생성
const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 600;

// Context 가져오기 (그리기 도구)
const ctx = canvas.getContext('2d');
```

### 10.2 이미지 그리기

```tsx
const img = new Image();
img.onload = () => {
  // 기본 그리기
  ctx.drawImage(img, 0, 0);

  // 크기 조절해서 그리기
  ctx.drawImage(img, 0, 0, 400, 300);  // x, y, width, height

  // 일부분만 잘라서 그리기
  ctx.drawImage(img,
    50, 50, 100, 100,   // 원본에서 자를 영역
    0, 0, 200, 200      // 캔버스에 그릴 영역
  );
};
img.src = imageUrl;
```

### 10.3 변환 (Transform)

```tsx
// 이동 (translate)
ctx.translate(100, 50);  // x, y만큼 이동

// 회전 (rotate) - 라디안 단위!
ctx.rotate(Math.PI / 2);       // 90도
ctx.rotate(90 * Math.PI / 180); // 90도 (공식)

// 크기/반전 (scale)
ctx.scale(2, 2);     // 2배 확대
ctx.scale(-1, 1);    // 좌우 반전
ctx.scale(1, -1);    // 상하 반전

// 중심 기준 회전 패턴
ctx.translate(canvas.width / 2, canvas.height / 2);  // 중심으로 이동
ctx.rotate(90 * Math.PI / 180);                       // 회전
ctx.drawImage(img, -img.width / 2, -img.height / 2); // 중심 맞춰 그리기
```

### 10.4 클리핑 (마스킹)

```tsx
// 둥근 모서리 적용
ctx.beginPath();
ctx.roundRect(0, 0, width, height, 20);  // 둥근 사각형 경로
ctx.clip();  // 이 영역만 보이게

ctx.drawImage(img, 0, 0);  // 둥근 모서리로 잘림
```

### 10.5 이미지로 내보내기

```tsx
// Data URL로 변환
const pngUrl = canvas.toDataURL('image/png');
const jpgUrl = canvas.toDataURL('image/jpeg', 0.9);  // 품질 0~1
const webpUrl = canvas.toDataURL('image/webp', 0.8);

// Blob으로 변환 (파일 업로드용)
canvas.toBlob((blob) => {
  const file = new File([blob], 'image.png', { type: 'image/png' });
}, 'image/png');
```

---

## 11. 파일 처리 패턴

### 11.1 파일 선택 (input)

```tsx
function FileInput() {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log(file.name);  // 파일명
    console.log(file.size);  // 크기 (bytes)
    console.log(file.type);  // MIME 타입 (image/png 등)
  };

  return (
    <input
      type="file"
      accept="image/*"  // 이미지만 허용
      onChange={handleChange}
    />
  );
}
```

### 11.2 드래그 앤 드롭

```tsx
function DropZone({ onFileSelect }: Props) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();  // 필수!
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="border-2 border-dashed p-8"
    >
      파일을 여기에 드롭하세요
    </div>
  );
}
```

### 11.3 클립보드 붙여넣기

```tsx
function PasteArea({ onFileSelect }: Props) {
  const handlePaste = (e: React.ClipboardEvent) => {
    const file = e.clipboardData.files[0];
    if (file) onFileSelect(file);
  };

  return (
    <div onPaste={handlePaste} tabIndex={0}>
      Ctrl+V로 이미지를 붙여넣으세요
    </div>
  );
}
```

### 11.4 URL.createObjectURL / revokeObjectURL

```tsx
function ImagePreview() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    // 이전 URL 정리 (메모리 누수 방지)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    // 새 URL 생성
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return previewUrl ? <img src={previewUrl} /> : null;
}
```

### 11.5 이미지 크기 읽기

```tsx
function getImageSize(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);  // 정리
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('이미지 로드 실패'));
    };

    img.src = url;
  });
}

// 사용
const size = await getImageSize(file);
console.log(size.width, size.height);
```

### 11.6 다운로드 트리거

```tsx
function downloadImage(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 사용
downloadImage(canvas.toDataURL('image/png'), 'result.png');
```

---

## 12. Tailwind CSS 기초

### 12.1 클래스로 스타일 적용

```tsx
<div className="p-4 bg-white rounded-lg shadow">
  <h1 className="text-3xl font-bold text-center mb-4">제목</h1>
  <p className="text-gray-600">설명</p>
</div>
```

### 12.2 간격 (Spacing)

```
p-{숫자}   padding (전체)
px-{숫자}  padding-left, padding-right
py-{숫자}  padding-top, padding-bottom
pt, pr, pb, pl  각 방향

m-{숫자}   margin (전체)
mx-{숫자}  margin-left, margin-right
my-{숫자}  margin-top, margin-bottom
mt, mr, mb, ml  각 방향

숫자: 1=0.25rem, 2=0.5rem, 4=1rem, 8=2rem, 12=3rem...
```

### 12.3 글자 스타일

```
text-xs, text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl, text-4xl
font-normal, font-medium, font-semibold, font-bold
text-left, text-center, text-right
text-gray-500, text-red-500, text-blue-500...
```

### 12.4 배경색

```
bg-white, bg-black
bg-gray-100, bg-gray-200... bg-gray-900
bg-red-500, bg-blue-500, bg-green-500...
```

### 12.5 레이아웃

```tsx
{/* Flexbox */}
<div className="flex">              {/* 가로 배치 */}
<div className="flex flex-col">     {/* 세로 배치 */}
<div className="flex justify-between">  {/* 양쪽 끝 */}
<div className="flex justify-center">   {/* 가운데 */}
<div className="flex items-center">     {/* 세로 중앙 */}
<div className="flex gap-4">            {/* 요소 사이 간격 */}

{/* Grid */}
<div className="grid grid-cols-2">      {/* 2열 */}
<div className="grid grid-cols-3 gap-4"> {/* 3열 + 간격 */}
<div className="grid md:grid-cols-2">   {/* 반응형: 기본 1열, md 이상 2열 */}
```

### 12.6 테두리, 그림자

```
border              테두리
border-2            두꺼운 테두리
rounded             약간 둥근 모서리
rounded-lg          많이 둥근 모서리
rounded-full        원형
shadow              그림자
shadow-lg           큰 그림자
```

### 12.7 반응형 디자인

```tsx
<div className="
  grid
  grid-cols-1     {/* 기본: 1열 */}
  md:grid-cols-2  {/* 768px 이상: 2열 */}
  lg:grid-cols-3  {/* 1024px 이상: 3열 */}
">

{/* 반응형 접두사 */}
{/* sm: 640px 이상 */}
{/* md: 768px 이상 */}
{/* lg: 1024px 이상 */}
{/* xl: 1280px 이상 */}
```

### 12.8 상태 스타일

```tsx
<button className="
  bg-blue-500
  hover:bg-blue-600    {/* 마우스 올릴 때 */}
  active:bg-blue-700   {/* 클릭할 때 */}
  disabled:opacity-50  {/* 비활성화일 때 */}
  focus:ring-2         {/* 포커스일 때 */}
">
```

### 12.9 자주 쓰는 조합

```tsx
{/* 카드 */}
<div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">

{/* 버튼 */}
<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">

{/* 입력창 */}
<input className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500">

{/* 컨테이너 */}
<div className="max-w-6xl mx-auto p-4">
```

---

## 13. 자주 쓰는 패턴 모음

### 13.1 로딩 상태 처리

```tsx
function DataList() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Item[]>([]);

  if (loading) {
    return <p>로딩 중...</p>;
  }

  if (data.length === 0) {
    return <p>데이터가 없습니다.</p>;
  }

  return (
    <ul>
      {data.map(item => <li key={item.id}>{item.name}</li>)}
    </ul>
  );
}
```

### 13.2 에러 처리

```tsx
function Form() {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!input) {
      setError('입력값이 필요합니다');
      return;
    }
    setError(null);
    // 처리...
  };

  return (
    <div>
      <input onChange={() => setError(null)} />
      {error && <p className="text-red-500">{error}</p>}
      <button onClick={handleSubmit}>제출</button>
    </div>
  );
}
```

### 13.3 토글 패턴

```tsx
function Toggle() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(prev => !prev)}>
        {isOpen ? '닫기' : '열기'}
      </button>
      {isOpen && <div>내용</div>}
    </div>
  );
}
```

### 13.4 입력값 처리

```tsx
function SearchInput() {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (!query.trim()) return;
    console.log('검색:', query);
  };

  return (
    <div className="flex gap-2">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="검색어 입력..."
      />
      <button onClick={handleSearch}>검색</button>
    </div>
  );
}
```

### 13.5 파일 업로드

```tsx
function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    // 이미지 미리보기
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="미리보기" />}
      {file && <p>파일명: {file.name}</p>}
    </div>
  );
}
```

---

## 14. 정리

### 파일별 역할

| 확장자 | 위치 | 역할 |
|--------|------|------|
| `.ts` | `models/`, `viewmodels/` | 타입, 로직 |
| `.tsx` | `app/`, `components/` | UI 컴포넌트 |
| `.css` | `app/` | 스타일 |

### MVVM 체크리스트

- [ ] Model에 비즈니스 로직이 있나요? → ViewModel로 이동
- [ ] View에 상태 관리 로직이 있나요? → ViewModel로 이동
- [ ] ViewModel에 UI 코드(JSX)가 있나요? → View로 이동

### 다음 학습 추천

1. **React 심화**: useEffect, useContext, useRef, useMemo
2. **TypeScript 심화**: 유틸리티 타입 (Partial, Pick, Omit)
3. **Next.js 심화**: API Routes, 미들웨어, 메타데이터
4. **상태 관리**: Zustand, Redux Toolkit

---

> 이 문서는 R:EDEN 프로젝트와 함께 업데이트됩니다.
> 최종 업데이트: 2026-01-09
