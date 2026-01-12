//결과 카드
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QrResultCardProps {
  qrCodeUrl: string;
  onDownload: (format: 'png' | 'jpg') => void;
}

export function QrResultCard({ qrCodeUrl, onDownload }: QrResultCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>QR코드</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        {qrCodeUrl ? (
          <>
            <img src={qrCodeUrl} alt="QR Code" className="border rounded" />
            <div className="flex gap-2">
              <Button onClick={() => onDownload('png')} variant="secondary">PNG</Button>
              <Button onClick={() => onDownload('jpg')} variant="secondary">JPG</Button>
            </div>
          </>
        ) : (
          <div className="w-75 h-75 border rounded flex items-center justify-center text-gray-400">
            QR코드가 여기에 표시됩니다
          </div>
        )}
      </CardContent>
    </Card>
  );
}