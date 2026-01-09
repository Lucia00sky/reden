//설정 카드
 import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
  import { ColorPicker } from './ColorPicker';
  import { RangeSlider } from './RangeSlider';
  import { QrGeneratorState } from '@/models/types/qr';

  interface QrSettingsCardProps {
    state: QrGeneratorState;
    onTextChange: (text: string) => void;
    onFgColorChange: (color: string) => void;
    onBgColorChange: (color: string) => void;
    onSizeChange: (size: number) => void;
    onMarginChange: (margin: number) => void;
    onLogoChange: (file: File | null) => void;
    onErrorLevelChange: (level: 'L' | 'M' | 'Q' | 'H') => void;
    onGenerate: () => void;
    onClear: () => void;
  }

  export function QrSettingsCard({
    state,
    onTextChange,
    onFgColorChange,
    onBgColorChange,
    onSizeChange,
    onMarginChange,
    onLogoChange,
    onErrorLevelChange,
    onGenerate,
    onClear,
  }: QrSettingsCardProps) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 텍스트 입력 */}
          <div>
            <label className="text-sm font-medium mb-1 block">텍스트 / URL</label>
            <Input
              placeholder="URL 또는 텍스트를 입력하세요..."
              value={state.text}
              onChange={(e) => onTextChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onGenerate()}
            />
          </div>

          {/* 색상 선택 */}
          <div className="grid grid-cols-2 gap-4">
            <ColorPicker label="QR 색상" value={state.fgColor} onChange={onFgColorChange} />
            <ColorPicker label="배경 색상" value={state.bgColor} onChange={onBgColorChange} />
          </div>

          {/* 로고 업로드 */}
          <div>
            <label className="text-sm font-medium mb-1 block">로고 이미지</label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => onLogoChange(e.target.files?.[0] || null)}
            />
            {state.logo && (
              <p className="text-sm text-green-600 mt-1">로고가 선택되었습니다</p>
            )}
          </div>

          {/* 크기 & 여백 */}
          <RangeSlider label="크기" value={state.size} min={100} max={500} unit="px" onChange={onSizeChange} />
          <RangeSlider label="여백" value={state.margin} min={0} max={10} onChange={onMarginChange} />

          {/* 에러 정정 레벨 */}
          <div>
            <label className="text-sm font-medium mb-1 block">에러 정정 레벨</label>
            <div className="flex gap-2">
              {(['L', 'M', 'Q', 'H'] as const).map((level) => (
                <Button
                  key={level}
                  variant={state.errorLevel === level ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onErrorLevelChange(level)}
                >
                  {level}
                </Button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">높을수록 로고가 가려도 인식 가능 (H 권장)</p>
          </div>

          {/* 버튼 */}
          <div className="flex gap-2">
            <Button onClick={onGenerate}>생성하기</Button>
            <Button onClick={onClear} variant="outline">초기화</Button>
          </div>

          {state.error && <p className="text-red-500">{state.error}</p>}
        </CardContent>
      </Card>
    );
  }