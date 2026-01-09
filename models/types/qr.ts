export interface QrGeneratorState{
    text: string;
    qrCodeUrl: string;
    fgColor: string;
    bgColor: string;
    size: number;
    logo: string | null;
    errorLevel: 'L'|'M'|'Q'|'H'
    margin: number;
    error: string | null;
}