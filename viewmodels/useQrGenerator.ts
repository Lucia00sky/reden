import { useState, useRef } from "react";
import QrCode from 'qrcode';
import { QrGeneratorState } from "@/models/types/qr";

export function useQrGenerator() {
    const [state, setState] = useState<QrGeneratorState>({
        text:'',
        qrCodeUrl: '',
        fgColor: '#000000',
        bgColor: '#FFFFFF',
        size: 300,
        logo: null,
        errorLevel: 'M',
        margin:2,
        error:null,
    });


    const canvasRef = useRef<HTMLCanvasElement>(null);

    const setText = (text: string) => setState({ ...state, text, error: null });
    const setFgColor = (fgColor: string) => setState({ ...state, fgColor });
    const setBgColor = (bgColor: string) => setState({ ...state, bgColor });
    const setSize = (size: number) => setState({ ...state, size });
    const setErrorLevel = (errorLevel: 'L' | 'M' | 'Q' | 'H') => setState({ ...state, errorLevel });
    const setMargin = (margin: number) => setState({ ...state, margin });
    const setLogo = (file: File | null) => {
      if (!file) {
        setState({ ...state, logo: null });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setState({ ...state, logo: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    };

    const generate = async() => {
        if(!state.text.trim()){
            setState({ ...state, error: '텍스트를 입력해주세요'});
        }
        try{
            const qrDataUrl = await QrCode.toDataURL(state.text, {
                width: state.size,
                margin:state.margin,
                errorCorrectionLevel: state.errorLevel,
                color: {
                    dark: state.fgColor,
                    light: state.bgColor,
                }
            })
            //로고가 있으면 합성
            if(state.logo){
                const finalUrl = await addLogoToQr(qrDataUrl, state.logo, state.size);
                setState({ ...state, qrCodeUrl: finalUrl, error: null});
            } else {
                setState({ ...state,qrCodeUrl: qrDataUrl, error: null});
            }
        }
        catch(e){
            setState({ ...state, error: 'QR코드 생성에 실패했습니다' });
        }
    }

    const addLogoToQr = (qrDataUrl: string, logoDataUrl: string, size: number): Promise<string> =>{
        return new Promise((resolve)=>{
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            canvas.width = size;
            canvas.height = size;

            const qrImage = new Image
            onload = () =>{
                ctx.drawImage(qrImage, 0, 0, size, size);
                const logoImage = new Image();
                logoImage.onload = () => {
                    const logoSize = size * 0.25;
                    const logoX = (size - logoSize) *0.5;
                    const logoY = (size - logoSize) *0.5;

                    //로고 배경 (흰색 원)
                    ctx.fillStyle ='#FFFFFF';
                    ctx.beginPath();
                    ctx.arc(size *0.5, size *0.5, logoSize * 0.5 + 5, 0, Math.PI * 2);
                    ctx.fill();

                    //로고 이미지
                    ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
                    resolve(canvas.toDataURL('image/png'));
                };
                logoImage.src = logoDataUrl;
            };
            qrImage.src = qrDataUrl;     
        });
    };

    const download = (format: 'png' | 'jpg'| 'svg') => {
        if(!state.qrCodeUrl) return;

        const link = document.createElement('a');
        link.download = 'qrcode.${format}';
        if(format === 'jpg'){
            //JPG 변환
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            const img = new Image();
            img.onload = () => {
                 canvas.width = img.width;
            canvas.height = img.height;
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            link.href = canvas.toDataURL('image/jpeg', 0.9);
            link.click();
            };
            img.src = state.qrCodeUrl;
        }else{
            link.href = state.qrCodeUrl;
            link.click();
        }
    };
    const clear = () => {
      setState({
        text: '',
        qrCodeUrl: '',
        fgColor: '#000000',
        bgColor: '#FFFFFF',
        size: 300,
        logo: null,
        errorLevel: 'M',
        margin: 2,
        error: null,
      });
    };

    return {
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
    };
}