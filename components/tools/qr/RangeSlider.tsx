//범위 슬라이더 (재사용 가능)
  interface RangeSliderProps {
    label: string;
    value: number;
    min: number;
    max: number;
    unit?: string;
    onChange: (value: number) => void;
  }

  export function RangeSlider({ label, value, min, max, unit = '', onChange }: RangeSliderProps) {
    return (
      <div>
        <label className="text-sm font-medium mb-1 block">
          {label}: {value}{unit}
        </label>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full"
        />
      </div>
    );
  }