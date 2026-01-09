 import Link from "next/link";

  export default function Home() {
    const categories = [
      {
        title: "온라인 도구",
        href: "/tools",
        description: "이미지 압축, QR코드 생성, PDF 변환",
        icon: "🛠️",
      },
      {
        title: "개발자 도구",
        href: "/dev",
        description: "JSON 포맷터, Base64, 정규식 테스터",
        icon: "💻",
      },
      {
        title: "계산기",
        href: "/calc",
        description: "환율, 대출 이자, 연봉 계산기",
        icon: "🔢",
      },
    ];

    return (
      <div className="py-12">
        <h1 className="text-4xl font-bold text-center mb-4">R:EDEN</h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          세상의 모든 도구가 여기에
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="block p-6 bg-white border rounded-lg shadow hover:shadow-lg transition"
            >
              <div className="text-4xl mb-4">{cat.icon}</div>
              <h2 className="text-xl font-semibold mb-2">{cat.title}</h2>
              <p className="text-gray-600">{cat.description}</p>
            </Link>
          ))}
        </div>
      </div>
    );
  }