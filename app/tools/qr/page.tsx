//QR 페이지
 'use client';

  import { useQrGenerator } from '@/viewmodels/useQrGenerator';
  import { QrSettingsCard } from '@/components/tools/qr/QrSettingsCard';
  import { QrResultCard } from '@/components/tools/qr/QrResultCard';

  export default function QrGeneratorPage() {
    const {
      state,
      setText,
      setFgColor,
      setBgColor,
      setSize,
      setLogo,
      setErrorLevel,
      setMargin,
      generate,
      download,
      clear,
    } = useQrGenerator();

    return (
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-6">QR코드 생성기</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <QrSettingsCard
            state={state}
            onTextChange={setText}
            onFgColorChange={setFgColor}
            onBgColorChange={setBgColor}
            onSizeChange={setSize}
            onMarginChange={setMargin}
            onLogoChange={setLogo}
            onErrorLevelChange={setErrorLevel}
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