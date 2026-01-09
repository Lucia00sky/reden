
  'use client';

  import { useImageConverter } from '@/viewmodels/useImageConverter';
  import { ImageUploader } from '@/components/tools/image/ImageUploader';
  import { ImageSettings } from '@/components/tools/image/ImageSettings';
  import { ImagePreview } from '@/components/tools/image/ImagePreview';
  import { ImageActions } from '@/components/tools/image/ImageActions';

  export default function ImageConverterPage() {
    const {
      state,
      setFile,
      setFormat,
      setQuality,
      setWidth,
      setHeight,
      setKeepAspectRatio,
      setRotation,
      setFlipHorizontal,
      setFlipVertical,
      setBorderRadius,
      setRemoveExif,
      convertImage,
      downloadImage,
      clear,
    } = useImageConverter();

    return (
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-2">이미지 변환기</h1>
        <p className="text-gray-600 mb-8">
          포맷 변환, 리사이즈, 압축, 회전, 뒤집기
        </p>

        {/* 에러 메시지 */}
        {state.error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {state.error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* 왼쪽: 설정 */}
          <div className="space-y-4">
            <ImageUploader
              onFileSelect={setFile}
              currentFile={state.originalFile}
            />

            <ImageSettings
              state={state}
              onFormatChange={setFormat}
              onQualityChange={setQuality}
              onWidthChange={setWidth}
              onHeightChange={setHeight}
              onKeepAspectRatioChange={setKeepAspectRatio}
              onRotationChange={setRotation}
              onFlipHorizontalChange={setFlipHorizontal}
              onFlipVerticalChange={setFlipVertical}
              onBorderRadiusChange={setBorderRadius}
              onRemoveExifChange={setRemoveExif}
            />

            <ImageActions
              onConvert={convertImage}
              onDownload={downloadImage}
              onClear={clear}
              canConvert={!!state.originalFile}
              canDownload={!!state.resultUrl}
              isProcessing={state.isProcessing}
            />
          </div>

          {/* 오른쪽: 미리보기 */}
          <div>
            <ImagePreview
              originalUrl={state.originalUrl}
              resultUrl={state.resultUrl}
              isProcessing={state.isProcessing}
            />
          </div>
        </div>
      </div>
    );
  }