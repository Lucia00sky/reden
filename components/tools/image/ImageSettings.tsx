// 이미지 설정 패널 컴포넌트
'use client';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { ImageConverterState } from '@/models/types/image';

interface ImageSettingsProps {
    state: ImageConverterState;
    onFormatChange: (format: 'png' | 'jpeg' | 'webp') => void;
    onQualityChange: (quality: number) => void;
    onWidthChange: (width: number) => void;
    onHeightChange: (height: number) => void;
    onKeepAspectRatioChange: (keep: boolean) => void;
    onRotationChange: (rotation: 0 | 90 | 180 | 270) => void;
    onFlipHorizontalChange: (flip: boolean) => void;
    onFlipVerticalChange: (flip: boolean) => void;
    onBorderRadiusChange: (radius: number) => void;
    onRemoveExifChange: (remove: boolean) => void;
}

export function ImageSettings({
    state,
    onFormatChange,
    onQualityChange,
    onWidthChange,
    onHeightChange,
    onKeepAspectRatioChange,
    onRotationChange,
    onFlipHorizontalChange,
    onFlipVerticalChange,
    onBorderRadiusChange,
    onRemoveExifChange,
}: ImageSettingsProps) {

    // 이미지가 없으면 비활성화
    const disabled = !state.originalFile;

    return (
        <Card className="p-6 space-y-6">
            {/* 포맷 선택 */}
            <div>
                <label className="block text-sm font-medium mb-2">포맷</label>
                <div className="flex gap-2">
                    {(['png', 'jpeg', 'webp'] as const).map((format) => (
                        <Button
                            key={format}
                            variant={state.format === format ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => onFormatChange(format)}
                            disabled={disabled}
                        >
                            {format.toUpperCase()}
                        </Button>
                    ))}
                </div>
            </div>

            {/* 품질 (PNG 제외) */}
            {state.format !== 'png' && (
                <div>
                    <label className="block text-sm font-medium mb-2">
                        품질: {state.quality}%
                    </label>
                    <Slider
                        value={[state.quality]}
                        onValueChange={(value: number[]) => onQualityChange(value[0])}
                        min={1}
                        max={100}
                        step={1}
                        disabled={disabled}
                    />
                </div>
            )}

            {/* 크기 조절 */}
            <div>
                <label className="block text-sm font-medium mb-2">크기</label>
                <div className="flex gap-2 items-center mb-2">
                    <Input
                        type="number"
                        value={state.width || ''}
                        onChange={(e) => onWidthChange(Number(e.target.value))}
                        placeholder="너비"
                        className="w-24"
                        disabled={disabled}
                    />
                    <span>×</span>
                    <Input
                        type="number"
                        value={state.height || ''}
                        onChange={(e) => onHeightChange(Number(e.target.value))}
                        placeholder="높이"
                        className="w-24"
                        disabled={disabled}
                    />
                    <span className="text-sm text-gray-500">px</span>
                </div>
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="keepRatio"
                        checked={state.keepAspectRatio}
                         onCheckedChange={(checked: boolean) => onKeepAspectRatioChange(checked)}
                        disabled={disabled}
                    />
                    <label htmlFor="keepRatio" className="text-sm">비율 유지</label>
                </div>
            </div>

            {/* SNS 프리셋 */}
            <div>
                <label className="block text-sm font-medium mb-2">프리셋</label>
                <div className="flex flex-wrap gap-2">
                    {[
                        { name: '인스타', w: 1080, h: 1080 },
                        { name: '유튜브', w: 1280, h: 720 },
                        { name: '트위터', w: 1200, h: 675 },
                        { name: '페북', w: 1200, h: 630 },
                    ].map((preset) => (
                        <Button
                            key={preset.name}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                onWidthChange(preset.w);
                                onHeightChange(preset.h);
                            }}
                            disabled={disabled}
                        >
                            {preset.name}
                        </Button>
                    ))}
                </div>
            </div>

            {/* 회전 */}
            <div>
                <label className="block text-sm font-medium mb-2">회전</label>
                <div className="flex gap-2">
                    {([0, 90, 180, 270] as const).map((deg) => (
                        <Button
                            key={deg}
                            variant={state.rotation === deg ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => onRotationChange(deg)}
                            disabled={disabled}
                        >
                            {deg}°
                        </Button>
                    ))}
                </div>
            </div>

            {/* 뒤집기 */}
            <div>
                <label className="block text-sm font-medium mb-2">뒤집기</label>
                <div className="flex gap-2">
                    <Button
                        variant={state.flipHorizontal ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onFlipHorizontalChange(!state.flipHorizontal)}
                        disabled={disabled}
                    >
                        ↔ 좌우
                    </Button>
                    <Button
                        variant={state.flipVertical ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onFlipVerticalChange(!state.flipVertical)}
                        disabled={disabled}
                    >
                        ↕ 상하
                    </Button>
                </div>
            </div>

            {/* 둥근 모서리 */}
            <div>
                <label className="block text-sm font-medium mb-2">
                    둥근 모서리: {state.borderRadius}px
                </label>
                <Slider
                    value={[state.borderRadius]}
                    onValueChange={(value: number[]) => onBorderRadiusChange(value[0])}
                    min={0}
                    max={100}
                    step={1}
                    disabled={disabled}
                />
            </div>

            {/* EXIF 제거 */}
            <div className="flex items-center gap-2">
                <Checkbox
                    id="removeExif"
                    checked={state.removeExif}
                    onCheckedChange={(checked: boolean) => onRemoveExifChange(checked)}
                    disabled={disabled}
                />
                <label htmlFor="removeExif" className="text-sm">
                    EXIF 데이터 제거 (개인정보 보호)
                </label>
            </div>
        </Card>
    );
}