# R:EDEN - Claude 컨텍스트

## 이 파일은?
Claude가 새 세션에서 프로젝트를 빠르게 파악하기 위한 문서

## 프로젝트 개요
- **이름**: R:EDEN
- **한국어**: 세상의 모든 도구
- **목적**: 유틸리티 도구 사이트 + Google AdSense 수익화
- **타겟**: 한국, 영어권, 일본

## 기술 스택
- **Framework**: Next.js 16 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS + shadcn/ui
- **앱 변환**: Capacitor (웹 → 네이티브 앱)
- **배포**: Vercel (웹), Play Store & App Store (앱)
- **아키텍처**: MVVM 패턴

## 플랫폼 전략
```
Next.js (웹) + Capacitor (앱)
- 웹 코드 90% 재사용
- SEO 유지 (AdSense 수익에 유리)
- 스토어 배포 가능
```

## 목표 플랫폼
- [🔨] Web (PC/모바일 브라우저) - 개발 중
- [ ] Android App (Capacitor)
- [ ] iOS App (Capacitor)
- [ ] PWA (Progressive Web App)

## 다국어 지원
| 언어 | 사이트명 |
|-----|---------|
| 한국어 | R:EDEN - 세상의 모든 도구 |
| 영어 | R:EDEN - All Tools You Need |
| 일본어 | R:EDEN - すべてのツール |

## 디자인 전략
```
현재: shadcn/ui 기본 UI로 기능 구현
     ↓
추후: Figma로 디자인 정리 후 리디자인
```

### 현재 디자인
- **UI 라이브러리**: shadcn/ui (Tailwind 기반)
- **메인 컬러**: 초록 계열 (에덴 컨셉)
- **스타일**: 미니멀, 깔끔, 여백 많이
- **아이콘**: Lucide Icons

### 추후 리디자인 계획
- Figma로 전체 UI/UX 디자인 작업 예정
- MVVM 구조라 View(UI)만 수정하면 됨
- ViewModel(로직)은 그대로 유지
- 기능 완성 후 디자인 다듬기

## MVVM 아키텍처

### 레이어 구조
| 레이어 | 역할 | 위치 |
|-------|------|------|
| **Model** | 데이터 타입, 데이터 | `models/` |
| **View** | UI 컴포넌트 (순수 렌더링) | `app/`, `components/` |
| **ViewModel** | 상태 관리, 비즈니스 로직 | `viewmodels/` |

### 아키텍처 원칙
- **View**: UI만 담당, 로직 없음
- **ViewModel**: 커스텀 훅(useXXX)으로 상태/로직 관리
- **Model**: 데이터 타입과 API 호출만
- View는 ViewModel 훅을 호출해서 데이터와 함수를 받아 사용
- **리디자인 시 View만 수정** (MVVM의 장점)

### 코드 예시 (QR코드 생성기)
```tsx
// View (페이지) - app/tools/qr/page.tsx
const { state, setText, generate } = useQrGenerator();  // ViewModel 훅 호출
return <QrSettingsCard state={state} onTextChange={setText} onGenerate={generate} />;

// ViewModel (커스텀 훅) - viewmodels/useQrGenerator.ts
export function useQrGenerator() {
  const [state, setState] = useState<QrGeneratorState>({...});
  const generate = async () => { /* 비즈니스 로직 */ };
  return { state, setText, generate };
}

// Model (타입) - models/types/qr.ts
export interface QrGeneratorState { text: string; qrCodeUrl: string; error: string | null; }
```

## 폴더 구조 (MVVM)
```
D:\reden\
├── app/                      # View (페이지 라우팅)
│   ├── layout.tsx            # 공통 레이아웃
│   ├── page.tsx              # 메인 홈페이지
│   ├── globals.css           # 전역 스타일
│   ├── tools/                # 온라인 도구
│   │   ├── page.tsx          # 도구 목록 페이지
│   │   ├── qr/
│   │   │   └── page.tsx      # QR코드 생성기
│   │   └── image/
│   │       └── page.tsx      # 이미지 변환기
│   ├── dev/                  # 개발자 도구
│   └── calc/                 # 계산기
│
├── components/               # View (재사용 UI 컴포넌트)
│   ├── common/               # 공통 컴포넌트
│   │   └── ToolCard.tsx      # 도구 카드
│   ├── tools/                # 도구별 컴포넌트
│   │   ├── qr/
│   │   │   ├── QrSettingsCard.tsx
│   │   │   ├── QrResultCard.tsx
│   │   │   ├── ColorPicker.tsx
│   │   │   └── RangeSlider.tsx
│   │   └── image/
│   │       ├── ImageUploader.tsx
│   │       ├── ImageSettings.tsx
│   │       ├── ImagePreview.tsx
│   │       └── ImageActions.tsx
│   └── ui/                   # shadcn/ui 컴포넌트
│
├── viewmodels/               # ViewModel (커스텀 훅)
│   ├── useQrGenerator.ts
│   └── useImageConverter.ts
│
├── models/                   # Model
│   ├── types/                # TypeScript 타입 정의
│   │   ├── qr.ts
│   │   ├── image.ts
│   │   └── tool.ts
│   └── data/                 # 정적 데이터
│       └── tools.ts          # 도구 목록 데이터
│
├── docs/                     # 문서
│   └── TUTORIAL.md           # TypeScript/Next.js 교육 문서
├── lib/                      # shadcn/ui 유틸
├── public/                   # 정적 파일
├── android/                  # Capacitor Android (예정)
├── ios/                      # Capacitor iOS (예정)
└── CLAUDE.md
```

## 카테고리 구성

### 1. 온라인 도구 (/tools)
- [x] QR코드 생성기
- [x] 이미지 변환기 (리사이즈, 압축, 회전 통합)
- [ ] 바코드 생성기
- [ ] PDF 합치기/나누기

### 2. 개발자 도구 (/dev)
- [ ] JSON 포맷터
- [ ] Base64 인코더/디코더
- [ ] URL 인코더/디코더
- [ ] 정규식 테스터
- [ ] 색상 피커
- [ ] 해시 생성기

### 3. 계산기 (/calc)
- [ ] 환율 계산기
- [ ] 대출 이자 계산기
- [ ] 연봉 실수령액
- [ ] BMI 계산기
- [ ] 날짜 계산기
- [ ] 단위 변환기

## QR코드 생성기 기능

### 현재 구현 (풀버전)
- 텍스트/URL 입력
- QR/배경 색상 선택
- 크기 조절 (100~500px)
- 로고 삽입
- 에러 정정 레벨 (L/M/Q/H)
- 여백 조절
- 다운로드 (PNG, JPG)

### 향후 차별화 기능 (예정)
- [ ] 그라데이션 QR
- [ ] 프레임/테두리 추가
- [ ] 아트 QR (도트 모양 변경)
- [ ] WiFi QR (WiFi 자동 연결)
- [ ] 연락처/명함 QR (vCard)
- [ ] 이벤트 QR (캘린더 추가)
- [ ] QR 스캐너 (카메라로 읽기)
- [ ] 배치 생성 (여러 개 한번에)
- [ ] 히스토리 저장
- [ ] 템플릿 저장

## 이미지 변환기 기능

### 현재 구현 (풀버전)
- 포맷 변환 (PNG, JPEG, WEBP)
- 리사이즈 (너비/높이 픽셀 지정)
- 품질/압축 조절 (1~100%)
- 비율 유지 옵션
- 회전 (0°, 90°, 180°, 270°)
- 좌우/상하 반전
- 둥근 모서리
- EXIF 데이터 제거
- SNS 프리셋 (인스타, 유튜브, 트위터, 페북)
- 드래그 앤 드롭 업로드
- 클립보드 붙여넣기 (Ctrl+V)
- 원본/결과 미리보기

### 향후 추가 기능 (예정)
- [ ] HEIC → JPG 변환 (아이폰 사진)
- [ ] 배경 제거 (AI)
- [ ] 워터마크 삽입
- [ ] 배치 처리 (여러 이미지)
- [ ] 크롭 (자르기)
- [ ] 필터/효과

## 현재 진행 상황
- [x] 프로젝트 생성 (D:\reden)
- [x] layout.tsx - 헤더/푸터 완성
- [x] page.tsx - 메인 홈페이지 완성
- [x] MVVM 폴더 구조 생성
- [x] shadcn/ui 설치 (button, input, card, textarea, checkbox, slider)
- [x] QR코드 생성기 구현 (MVVM)
- [x] 도구 목록 페이지 (/tools) 완성
- [x] TypeScript/Next.js 교육 문서 작성
- [x] GitHub 업로드 및 Vercel 배포
- [x] 이미지 변환기 구현 (MVVM)
- [ ] 다른 도구 추가 (JSON 포맷터, 바코드 등)
- [ ] Capacitor 설정
- [ ] AdSense 연동
- [ ] Figma 디자인 작업 (추후)

## 사용자 요청 스타일
- 코드 직접 작성 원함 (명령어/코드 제공하면 직접 실행)
- 데스크톱/앱 개발 경험 있음, 웹은 처음
- 코드 설명 요청 시 상세히 설명 필요
- MVVM 패턴 선호 (유지보수 용이)
- 디자인은 기능 완성 후 Figma로 정리 예정

## 다음 할 일
1. 개발자 도구 페이지 (/dev) - JSON 포맷터
2. 계산기 페이지 (/calc) - 환율 계산기
3. Capacitor 초기 설정 (앱 배포)
4. AdSense 연동

## 트러블슈팅 기록
| 문제 | 원인 | 해결 |
|-----|------|------|
| CSS 에러 | `@import "tw-animate-css"` 없는 패키지 | 해당 줄 삭제 |
| 스타일 안 먹음 | `@import "tailwindcss"` 누락 | globals.css 맨 위에 추가 |
| 모듈 못 찾음 | 파일명 오타 (userQr → useQr) | 파일명 수정 |
