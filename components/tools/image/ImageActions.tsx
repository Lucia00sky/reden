
  'use client';

  import { Button } from '@/components/ui/button';

  interface ImageActionsProps {
    onConvert: () => void;
    onDownload: () => void;
    onClear: () => void;
    canConvert: boolean;
    canDownload: boolean;
    isProcessing: boolean;
  }

  export function ImageActions({
    onConvert,
    onDownload,
    onClear,
    canConvert,
    canDownload,
    isProcessing,
  }: ImageActionsProps) {
    return (
      <div className="flex gap-2 mt-4">
        <Button
          onClick={onConvert}
          disabled={!canConvert || isProcessing}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          {isProcessing ? '변환 중...' : '변환하기'}
        </Button>

        <Button
          onClick={onDownload}
          disabled={!canDownload}
          variant="outline"
          className="flex-1"
        >
          다운로드
        </Button>

        <Button
          onClick={onClear}
          variant="ghost"
        >
          초기화
        </Button>
      </div>
    );
  }