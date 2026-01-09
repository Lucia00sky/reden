// 이미지 미리보기 컴포넌트

 'use client';

  import { Card } from '@/components/ui/card';

  interface ImagePreviewProps {
    originalUrl: string | null;
    resultUrl: string | null;
    isProcessing: boolean;
  }

  export function ImagePreview({ originalUrl, resultUrl, isProcessing }: ImagePreviewProps) {
    return (
      <div className="space-y-4">
        {/* 원본 이미지 */}
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-2">원본</h3>
          <div className="bg-gray-100 rounded-lg min-h-50 flex items-center justify-center">
            {originalUrl ? (
              <img
                src={originalUrl}
                alt="원본 이미지"
                className="max-w-full max-h-75 object-contain"
              />
            ) : (
              <p className="text-gray-400">이미지를 업로드하세요</p>
            )}
          </div>
        </Card>

        {/* 결과 이미지 */}
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-2">결과</h3>
          <div className="bg-gray-100 rounded-lg min-h-50 flex items-center justify-center">
            {isProcessing ? (
              <div className="text-center">
                <div className="animate-spin text-2xl mb-2">⏳</div>
                <p className="text-gray-500">변환 중...</p>
              </div>
            ) : resultUrl ? (
              <img
                src={resultUrl}
                alt="결과 이미지"
                className="max-w-full max-h-75 object-contain"
              />
            ) : (
              <p className="text-gray-400">변환 버튼을 눌러주세요</p>
            )}
          </div>
        </Card>
      </div>
    );
  }
