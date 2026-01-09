//공통 컴포넌트
import { Input } from '@/components/ui/input';

interface ColorPickerProps{
    label: string;
    value: string;
    onChange: (value: string) => void;
}

export function ColorPicker({label, value, onChange}: ColorPickerProps){
    return(
        <div>
            <label className="text-sm font-medium mb-1 block">{label}</label>
            <div className='flex gap-2'>
                <input type="color" value={value} onChange={(e)=> onChange(e.target.value)}
                className="w-12 h-10 rounded cursor-pointer"/>
                <input value={value}
                onChange={(e)=> onChange(e.target.value)}
                className="flex-1"/>
            </div>
        </div>
    );
}