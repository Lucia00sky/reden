//이미지 변환기 상태 타입 정의

export interface ImageConverterState {
    originalFile: File | null; //원본파일
    originalUrl: string| null; //원본 이미지 미리보기 URL
    resultUrl: string | null;  //변환된 이미지 URL

    format: 'png' | 'jpeg' | 'webp'; //변환 포맷
    quality: number; // 0 to 100      //변환 품질 (jpeg, webp에만 해당)

    width: number;  //변환 너비
    height: number; //변환 높이
    keepAspectRatio: boolean; //가로세로 비율 유지 여부

    rotation: 0 | 90 | 180 | 270; //회전 각도
    flipHorizontal: boolean; //수평 뒤집기
    flipVertical: boolean;   //수직 뒤집기

    removeExif: boolean;   //EXIF 메타데이터 제거 여부
    borderRadius: number;  //테두리 둥글게 처리 반경 (0~50 숫자)

    error: string | null;  //오류 메시지
    isProcessing: boolean; //처리 중 여부
}