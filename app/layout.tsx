import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
  //- Metadata: 페이지 제목, 설명 등 SEO 정보 타입
  //- Inter: 구글 폰트 (깔끔한 기본 폰트)
  //- globals.css: 전체 스타일 파일
  //- Link: 페이지 이동용 컴포넌트 (a 태그 대신 사용)



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "R:EDEN - 세상의 모든 도구",
  description: "일상, 개발, 업무에 필요한 모든 온라인 도구",
};

export default function RootLayout({ //RootLayout
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="bg-green-600 text-white p-4">
          <nav className = "max-w-6xl mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">R:EDEN</Link>
            <div className="space-x-4">
              <Link href ="/tools" className="hover:underline">도구모음</Link>
              <Link href ="/dev" className="hover:underline">개발자 도구</Link>
              <Link href ="/calc" className="hover:underline">계산기</Link>
            </div>
          </nav>
        </header>
        <main className="max-w-6xl mx-auto p-4">
        {children}
        </main>
        <footer className="bg-gray-100 text-center p-4 mt-8">
         <p>© 2026 R:EDEN. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );

  //- RootLayout: 최상위 레이아웃 함수
  //- children: 각 페이지의 내용이 여기에 들어옴
  //- lang="ko": 한국어 사이트임을 명시
  //- className={inter.className}: Inter 폰트 적용
  //- header: 상단 헤더 영역
  //- bg-green-600: 초록색 배경 (Tailwind CSS)
  //- text-white: 흰색 글씨
  //- p-4: padding 4 (여백)
  //- nav: 네비게이션 영역
  //- max-w-6xl: 최대 너비 제한
  //- mx-auto: 가운데 정렬
  //- flex: 가로 배치
  //- justify-between: 양쪽 끝 배치
  //- items-center: 세로 중앙 정렬
  //- 클릭하면 홈(/)으로 이동하는 로고
  //- space-x-4: 링크들 사이 간격
  //- hover:underline: 마우스 올리면 밑줄
  //- main: 본문 영역
  //- {children}: 각 페이지 내용이 여기에 표시됨
  //- footer: 하단 푸터
  //- mt-8: margin-top (위쪽 여백)
}
