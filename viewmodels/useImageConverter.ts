//이미지 변환기 ViewModel (커스텀 훅)

import { useState, useCallback } from 'react';
import { ImageConverterState } from '../models/types/image';


// TODO: 초기 상태 객체 만들기

const initialState: ImageConverterState = {
    originalFile: null,
    originalUrl: null,
    resultUrl: null,
    format: 'png',
    quality: 90,
    width: 0,
    height: 0,
    keepAspectRatio: true,
    rotation: 0,
    flipHorizontal: false,
    flipVertical: false,
    removeExif: true,
    borderRadius: 0,
    error: null,
    isProcessing: false,
};


export function useImageConverter() {
    const [state, setState] = useState<ImageConverterState>(initialState);
    const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });

    //파일 업로드
    // - file을 state.originalFile에 저장
    // - URL.createObjectURL(file)로 미리보기 URL 생성
    // - 이미지의 원본 width, height 읽어서 state에 저장
    //   힌트: new Image() 객체 사용, onload 이벤트에서 naturalWidth, naturalHeight

    const setFile = useCallback((file: File) => {
        const url = URL.createObjectURL(file); // 미리보기 URL 생성

        const img = new Image();
        img.onload = () => {
            //이미지 로드되면 실행
            setOriginalSize({ width: img.naturalWidth, height: img.naturalHeight });
            setState(prev => ({
                ...prev, // 이전 상태(prev)에 들어 있던 모든 속성을 그대로 복사한다 는 뜻이야.
                //“기존 state는 일단 전부 유지하고, 아래에 적은 값들만 새 값으로 덮어쓴다”
                originalFile: file,
                originalUrl: url,
                resultUrl: null,
                width: img.naturalWidth,
                height: img.naturalHeight,
                error: null,
            }));
        };
        img.onerror = () => {
            setState(prev => ({ ...prev, error: '이미지를 불러올 수 없습니다.' }));
        };
        img.src = url;
    }, []);

    // 3. 설정 변경 함수들

    // const setKeepAspectRatio = (keep: boolean) => { ... }
    // const setRotation = (rotation: 0 | 90 | 180 | 270) => { ... }
    // const setFlipHorizontal = (flip: boolean) => { ... }
    // const setFlipVertical = (flip: boolean) => { ... }
    // const setRemoveExif = (remove: boolean) => { ... }
    // const setBorderRadius = (radius: number) => { ... }
    //
    // 힌트: 각 함수는 setState로 해당 속성만 업데이트
    // 힌트: setWidth에서 keepAspectRatio가 true면 height도 비율에 맞게 자동 계산

    const setFormat = useCallback((format: 'png' | 'jpeg' | 'webp') => {
        setState(prev => ({
            ...prev, format
        }));
    }, []);

    const setQuality = useCallback((quality: number) => {
        setState(prev => ({
            ...prev, quality
        }))
    }, []);

    const setWidth = useCallback((width: number) => {
        setState(prev => {
            if (prev.keepAspectRatio && originalSize.width > 0) {
                const aspectRatio = originalSize.height / originalSize.width;
                return { ...prev, width, height: Math.round(width * aspectRatio) };
            }
            return { ...prev, width };
        })
    }, [originalSize]);

    const setHeight = useCallback((height: number) => {
        setState(prev => {
            if (prev.keepAspectRatio && originalSize.height > 0) {
                const aspectRatio = originalSize.width / originalSize.height;
                return { ...prev, height, width: Math.round(height * aspectRatio) };
            }
            return { ...prev, height };
        });
    }, [originalSize]);

    // 비율 유지 토글
    const setKeepAspectRatio = useCallback((keep: boolean) => {
        setState(prev => ({ ...prev, keepAspectRatio: keep }));
    }, []);

    // 회전 변경
    const setRotation = useCallback((rotation: 0 | 90 | 180 | 270) => {
        setState(prev => ({ ...prev, rotation }));
    }, []);

    // 좌우 반전 토글
    const setFlipHorizontal = useCallback((flip: boolean) => {
        setState(prev => ({ ...prev, flipHorizontal: flip }));
    }, []);

    // 상하 반전 토글
    const setFlipVertical = useCallback((flip: boolean) => {
        setState(prev => ({ ...prev, flipVertical: flip }));
    }, []);

    // EXIF 제거 토글
    const setRemoveExif = useCallback((remove: boolean) => {
        setState(prev => ({ ...prev, removeExif: remove }));
    }, []);

    // 둥근 모서리 변경
    const setBorderRadius = useCallback((radius: number) => {
        setState(prev => ({ ...prev, borderRadius: radius }));
    }, []);

    // 4. 이미지 변환 함수 (핵심!)

    // 해야 할 일:
    // - isProcessing을 true로 설정
    // - Canvas 생성: document.createElement('canvas')
    // - Canvas 크기 설정: state.width, state.height
    // - Context 가져오기: canvas.getContext('2d')
    //
    // - 회전 처리:
    //   힌트: ctx.translate()로 중심점 이동
    //   힌트: ctx.rotate()로 회전 (라디안 = 각도 * Math.PI / 180)
    //
    // - 뒤집기 처리:
    //   힌트: ctx.scale(-1, 1)은 좌우 반전
    //   힌트: ctx.scale(1, -1)은 상하 반전
    //
    // - 둥근 모서리 처리:
    //   힌트: ctx.beginPath(), ctx.roundRect(), ctx.clip() 사용
    //
    // - 이미지 그리기: ctx.drawImage(img, 0, 0, width, height)
    //
    // - 결과 URL 생성:
    //   힌트: canvas.toDataURL(`image/${format}`, quality/100)
    //
    // - resultUrl에 저장, isProcessing을 false로
    const convertImage = useCallback(async () => {
        if (!state.originalUrl) {
            setState(prev => ({ ...prev, error: '변환할 이미지가 없습니다.' }));
            return;
        }

        setState(prev => ({ ...prev, isProcessing: true, error: null }));
        try {
            const img = new Image();
            img.crossOrigin = 'Anonymous';

            await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = () => reject(new Error('이미지 로드 실패'));
                img.src = state.originalUrl!;
            });

            //회전시 캔버스 크기 조정
            const isRotated = state.rotation === 90 || state.rotation === 270;
            const canvasWidth = isRotated ? state.height : state.width;
            const canvasHeight = isRotated ? state.width : state.height;

            const canvas = document.createElement('canvas');
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            const ctx = canvas.getContext('2d')!;
            if (!ctx) throw new Error('캔버스 컨텍스트를 가져올 수 없습니다.');

            // 캔버스 중심으로 이동
            ctx.translate(canvasWidth / 2, canvasHeight / 2);

            // 회전 적용
            if (state.rotation !== 0) {
                ctx.rotate((state.rotation * Math.PI) / 180);
            }

            // 뒤집기 적용
            const scaleX = state.flipHorizontal ? -1 : 1;
            const scaleY = state.flipVertical ? -1 : 1;
            ctx.scale(scaleX, scaleY);

            // 둥근 모서리 적용
            if (state.borderRadius > 0) {
                ctx.beginPath();
                const w = state.width;
                const h = state.height;
                const r = state.borderRadius;
                ctx.roundRect(-w / 2, -h / 2, w, h, r);
                ctx.clip();
            }
            // 이미지 그리기
            ctx.drawImage(img, -state.width / 2, -state.height / 2, state.width, state.height);

            // 결과 URL 생성
            const mimeType = `image/${state.format}`;
            const qualityValue = state.format === 'png' ? undefined : state.quality / 100;
            const resultUrl = canvas.toDataURL(mimeType, qualityValue);

            setState(prev => ({ ...prev, resultUrl, isProcessing: false }));
        }
        catch (e) {
            setState(prev => ({ ...prev, error: '이미지 변환에 실패했습니다.', isProcessing: false }));
        }
    }, [state.originalUrl, state.width, state.height, state.rotation, state.flipHorizontal, state.flipVertical, state.borderRadius, state.format, state.quality]);


    // ----------------------------------------
    // 5. 다운로드 함수
    // ----------------------------------------
    // const download = () => { ... }
    //
    // 해야 할 일:
    // - <a> 태그 생성
    // - href에 resultUrl 설정
    // - download 속성에 파일명 설정 (예: 'converted.png')
    // - 클릭 이벤트 발생시켜서 다운로드
    //
    // 힌트: QR코드의 download 함수 참고!
    const downloadImage = useCallback(() => {
        if (!state.resultUrl) return;

        const link = document.createElement('a');
        link.href = state.resultUrl;
        link.download = `converted.${state.format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [state.resultUrl, state.format]);

    // 6. 초기화 함수
    // ----------------------------------------
    // const clear = () => { ... }
    //
    // - state를 초기값으로 리셋
    // - URL.revokeObjectURL()로 메모리 정리
    const clear = useCallback(() => {
        if (state.originalUrl) {
            URL.revokeObjectURL(state.originalUrl);
        }
        setState(initialState);
        setOriginalSize({ width: 0, height: 0 });
    }, [state.originalUrl]);

    // 7. return
    // ----------------------------------------
    // return { state, setFile, setFormat, setQuality, ... , convert, download, clear };
    return {
        state,
        setFile,
        setFormat,
        setQuality,
        setWidth,
        setHeight,
        setKeepAspectRatio,
        setRotation,
        setFlipHorizontal,
        setFlipVertical,
        setRemoveExif,
        setBorderRadius,
        convertImage,
        downloadImage,
        clear,
    };
}

//  핵심 포인트 설명
//   ┌──────────────────┬────────────────────────────────────────────────────┐
//   │       부분       │                        설명                         │
//   ├──────────────────┼────────────────────────────────────────────────────┤
//   │ useCallback      │ 함수가 불필요하게 재생성되는 것 방지 (성능 최적화)     │
//   ├──────────────────┼────────────────────────────────────────────────────┤
//   │ originalSize     │ 비율 계산용 원본 크기 별도 저장                       │
//   ├──────────────────┼────────────────────────────────────────────────────┤
//   │ ...prev          │ 스프레드 연산자로 기존 상태 유지하면서 일부만 변경     │
//   ├──────────────────┼────────────────────────────────────────────────────┤
//   │ ctx.translate    │ 캔버스 중심점을 가운데로 이동 (회전 기준점)           │
//   ├──────────────────┼────────────────────────────────────────────────────┤
//   │ ctx.rotate       │ 라디안 단위 (각도 × π ÷ 180)                        │
//   ├──────────────────┼────────────────────────────────────────────────────┤
//   │ ctx.scale(-1, 1) │ 좌우 반전                                           │
//   ├──────────────────┼────────────────────────────────────────────────────┤
//   │ ctx.roundRect    │ 둥근 모서리 클리핑                                  │
//   ├──────────────────┼────────────────────────────────────────────────────┤
//   │ toDataURL        │ 캔버스를 이미지 URL로 변환                           │
//└──────────────────┴───────────────────────────────────────────────────────┘

//<-- 설명: setFile 함수 -->

//   전체 흐름
//   파일 선택 → URL 생성 → 이미지 로드 → 크기 읽기 → 상태 저장

//   코드 설명
//   1. useCallback 감싸기
//   const setFile = useCallback((file: File) => {
//       // ...
//   }, []);
//   - useCallback: 함수를 메모리에 저장해서 재사용 (성능 최적화)
//   - []: 의존성 배열이 비어있음 = 함수가 한 번만 생성됨

//   ---
//   2. 미리보기 URL 생성

//   const url = URL.createObjectURL(file);
//   - File 객체를 브라우저에서 볼 수 있는 URL로 변환
//   - 예: blob:http://localhost:3000/abc-123-def
//   - 이 URL을 <img src={url}>에 넣으면 이미지가 보임

//   ---
//   3. 이미지 객체 생성

//   const img = new Image();
//   - HTML <img> 태그와 같은 역할
//   - 이미지의 실제 크기(width, height)를 읽기 위해 필요

//   ---
//   4. 이미지 로드 성공 시

//   img.onload = () => {
//       // 이미지가 완전히 로드되면 실행
//       setOriginalSize({ width: img.naturalWidth, height: img.naturalHeight });
//       setState(prev => ({
//           ...prev,
//           originalFile: file,
//           originalUrl: url,
//           resultUrl: null,
//           width: img.naturalWidth,
//           height: img.naturalHeight,
//           error: null,
//       }));
//   };
//   ┌──────────────────────────┬─────────────────────────────────────┐
//   │           코드           │                설명                 │
//   ├──────────────────────────┼─────────────────────────────────────┤
//   │ img.naturalWidth         │ 이미지의 실제 원본 너비 (픽셀)      │
//   ├──────────────────────────┼─────────────────────────────────────┤
//   │ img.naturalHeight        │ 이미지의 실제 원본 높이 (픽셀)      │
//   ├──────────────────────────┼─────────────────────────────────────┤
//   │ setOriginalSize          │ 비율 계산용으로 원본 크기 별도 저장 │
//   ├──────────────────────────┼─────────────────────────────────────┤
//   │ prev => ({...prev, ...}) │ 기존 상태 유지하면서 일부만 변경    │
//   ├──────────────────────────┼─────────────────────────────────────┤
//   │ resultUrl: null          │ 새 이미지 올리면 이전 결과 초기화   │
//   └──────────────────────────┴─────────────────────────────────────┘
//   ---
//   5. 이미지 로드 실패 시

//   img.onerror = () => {
//       setState(prev => ({ ...prev, error: '이미지를 불러올 수 없습니다.' }));
//   };
//   - 잘못된 파일이거나 손상된 이미지일 때 에러 메시지 표시

//   ---
//   6. 이미지 로드 시작

//   img.src = url;
//   - src에 URL을 넣으면 브라우저가 이미지를 로드 시작
//   - 로드 완료 → onload 실행
//   - 로드 실패 → onerror 실행

//   ---
//   실행 순서 (중요!)

//   1. setFile(file) 호출
//   2. URL 생성 (즉시)
//   3. img.src = url (로드 시작)
//   4. --- 이미지 로딩 중 (비동기) ---
//   5. 로드 완료 → onload 실행 → 상태 업데이트

//   왜 onload를 쓰나요?
//   - 이미지 로딩은 비동기라서 시간이 걸림
//   - img.src = url 직후에 img.naturalWidth를 읽으면 0이 나옴 (아직 로드 안 됨)
//   - onload 안에서 읽어야 실제 크기를 얻을 수 있음

//   ---
//   비유로 이해하기

//   1. 사진 파일을 받음 (file)
//   2. 액자에 걸 수 있는 주소표 만듦 (URL.createObjectURL)
//   3. 빈 액자 준비 (new Image())
//   4. "사진 걸리면 크기 재줘" 메모 붙임 (onload)
//   5. "사진 못 걸면 알려줘" 메모 붙임 (onerror)
//   6. 액자에 사진 걸기 시작 (img.src = url)
//   7. ... 사진 걸리는 중 ...
//   8. 완료! → 크기 측정 → 저장

// ConvertImage 함수 핵심 포인트 설명
//  convert 함수를 단계별로 설명할게요! 이게 핵심 로직이에요.

//   전체 흐름

//   이미지 로드 → 캔버스 생성 → 변환 적용 (회전/반전/둥근모서리) → 결과 URL 생성

//   ---
//   코드 설명

//   1. 유효성 검사

//   if (!state.originalUrl) {
//       setState(prev => ({ ...prev, error: '이미지를 먼저 업로드해주세요.' }));
//       return;
//   }
//   - 이미지가 없으면 에러 표시하고 종료

//   ---
//   2. 처리 중 상태로 변경

//   setState(prev => ({ ...prev, isProcessing: true, error: null }));
//   - 로딩 스피너 표시용
//   - 기존 에러 초기화

//   ---
//   3. 이미지 로드 (Promise로 감싸기)

//   const img = new Image();
//   img.crossOrigin = 'anonymous';

//   await new Promise<void>((resolve, reject) => {
//       img.onload = () => resolve();
//       img.onerror = () => reject(new Error('이미지 로드 실패'));
//       img.src = state.originalUrl!;
//   });
//   ┌───────────────────────────┬────────────────────────────────────┐
//   │           코드            │                설명                │
//   ├───────────────────────────┼────────────────────────────────────┤
//   │ crossOrigin = 'anonymous' │ 외부 이미지도 처리 가능하게 (CORS) │
//   ├───────────────────────────┼────────────────────────────────────┤
//   │ new Promise               │ onload를 await할 수 있게 감싸기    │
//   ├───────────────────────────┼────────────────────────────────────┤
//   │ resolve()                 │ 로드 성공 → 다음 코드 진행         │
//   ├───────────────────────────┼────────────────────────────────────┤
//   │ reject()                  │ 로드 실패 → catch로 이동           │
//   └───────────────────────────┴────────────────────────────────────┘
//   왜 Promise로 감싸나요?
//   // ❌ 이렇게 하면 안 됨 (이미지 로드 전에 다음 코드 실행)
//   img.src = url;
//   ctx.drawImage(img, ...);  // img가 아직 비어있음!

//   // ✅ Promise + await로 기다림
//   await new Promise(...);
//   ctx.drawImage(img, ...);  // img 로드 완료 후 실행

//   ---
//   4. 캔버스 크기 계산

//   const isRotated = state.rotation === 90 || state.rotation === 270;
//   const canvasWidth = isRotated ? state.height : state.width;
//   const canvasHeight = isRotated ? state.width : state.height;

//   왜 회전할 때 크기를 바꾸나요?
//   원본 (400 x 200):
//   ┌────────────────┐
//   │                │
//   └────────────────┘

//   90° 회전 후 (200 x 400):
//   ┌────┐
//   │    │
//   │    │
//   │    │
//   │    │
//   └────┘
//   - 90°, 270° 회전하면 가로↔세로가 뒤바뀜

//   ---
//   5. 캔버스 생성

//   const canvas = document.createElement('canvas');
//   canvas.width = canvasWidth;
//   canvas.height = canvasHeight;

//   const ctx = canvas.getContext('2d');
//   if (!ctx) throw new Error('Canvas 지원 안됨');
//   ┌──────────────────┬───────────────────────┐
//   │       코드       │         설명          │
//   ├──────────────────┼───────────────────────┤
//   │ canvas           │ 그림 그리는 도화지    │
//   ├──────────────────┼───────────────────────┤
//   │ ctx (context)    │ 붓 (실제 그리기 도구) │
//   ├──────────────────┼───────────────────────┤
//   │ getContext('2d') │ 2D 그리기 모드        │
//   └──────────────────┴───────────────────────┘
//   ---
//   6. 캔버스 중심으로 이동

//   ctx.translate(canvasWidth / 2, canvasHeight / 2);

//   왜 중심으로 이동하나요?
//   기본 (0,0 기준 회전):          중심 기준 회전:
//       ↱ 회전축                    ↱ 회전축
//   ┌───●────────┐               ┌────────────┐
//   │            │               │     ●      │
//   │            │               │            │
//   └────────────┘               └────────────┘
//    → 이상하게 회전됨              → 제자리에서 회전

//   ---
//   7. 회전 적용

//   if (state.rotation !== 0) {
//       ctx.rotate((state.rotation * Math.PI) / 180);
//   }
//   ┌──────┬───────────────┬──────┐
//   │ 각도 │  라디안 계산  │ 결과 │
//   ├──────┼───────────────┼──────┤
//   │ 90°  │ 90 × π ÷ 180  │ π/2  │
//   ├──────┼───────────────┼──────┤
//   │ 180° │ 180 × π ÷ 180 │ π    │
//   ├──────┼───────────────┼──────┤
//   │ 270° │ 270 × π ÷ 180 │ 3π/2 │
//   └──────┴───────────────┴──────┘
//   - Canvas는 라디안 단위 사용 (각도 아님!)
//   - 공식: 라디안 = 각도 × π ÷ 180

//   ---
//   8. 뒤집기 적용

//   const scaleX = state.flipHorizontal ? -1 : 1;
//   const scaleY = state.flipVertical ? -1 : 1;
//   ctx.scale(scaleX, scaleY);

//   원본:        scale(-1, 1):    scale(1, -1):
//    ABC          CBA              ABC
//    DEF          FED              DEF
//                                  ↓
//                                  DEF
//                                  ABC
//   좌우반전         상하반전

//   ---
//   9. 둥근 모서리 적용

//   if (state.borderRadius > 0) {
//       ctx.beginPath();
//       const w = state.width;
//       const h = state.height;
//       const r = state.borderRadius;
//       ctx.roundRect(-w / 2, -h / 2, w, h, r);
//       ctx.clip();
//   }
//   ┌─────────────┬──────────────────────────────┐
//   │    코드     │             설명             │
//   ├─────────────┼──────────────────────────────┤
//   │ beginPath() │ 새 경로 시작                 │
//   ├─────────────┼──────────────────────────────┤
//   │ roundRect() │ 둥근 사각형 경로 그리기      │
//   ├─────────────┼──────────────────────────────┤
//   │ clip()      │ 이 영역 밖은 잘라냄 (마스킹) │
//   └─────────────┴──────────────────────────────┘
//   clip() 전:              clip() 후:
//   ┌────────────────┐      ╭────────────────╮
//   │  ┌──────────┐  │      │                │
//   │  │  이미지  │  │  →   │     이미지     │
//   │  └──────────┘  │      │                │
//   └────────────────┘      ╰────────────────╯

//   ---
//   10. 이미지 그리기

//   ctx.drawImage(img, -state.width / 2, -state.height / 2, state.width, state.height);

//   왜 -width/2, -height/2인가요?
//   translate로 중심에 있으니까:

//        중심(0,0)
//           ↓
//      ┌────●────┐
//      │         │
//      └─────────┘

//   이미지를 중심에 맞추려면:
//   시작점 = (-너비/2, -높이/2)

//   ---
//   11. 결과 URL 생성

//   const mimeType = `image/${state.format}`;
//   const qualityValue = state.format === 'png' ? undefined : state.quality / 100;
//   const resultUrl = canvas.toDataURL(mimeType, qualityValue);
//   ┌──────────────┬─────────────────────────────────────┐
//   │     코드     │                설명                 │
//   ├──────────────┼─────────────────────────────────────┤
//   │ mimeType     │ image/png, image/jpeg, image/webp   │
//   ├──────────────┼─────────────────────────────────────┤
//   │ qualityValue │ 0.0 ~ 1.0 (PNG는 무손실이라 무시됨) │
//   ├──────────────┼─────────────────────────────────────┤
//   │ toDataURL()  │ 캔버스를 이미지 URL로 변환          │
//   └──────────────┴─────────────────────────────────────┘
//   결과 예시:
//   data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...

//   ---
//   12. 상태 업데이트

//   setState(prev => ({ ...prev, resultUrl, isProcessing: false }));
//   - 결과 URL 저장
//   - 로딩 상태 해제

//   ---
//   13. 에러 처리

//   catch (error) {
//       setState(prev => ({
//           ...prev,
//           error: error instanceof Error ? error.message : '변환 중 오류 발생',
//           isProcessing: false,
//       }));
//   }
//   - 어디서든 에러 발생하면 여기로 옴
//   - 에러 메시지 표시 + 로딩 해제

//   ---
//   시각적 요약

//   1. 원본 이미지 로드
//      ┌─────────┐
//      │  HELLO  │
//      └─────────┘
//           ↓
//   2. 캔버스 중심으로 이동 (translate)
//           ●
//           ↓
//   3. 회전 적용 (rotate 90°)
//      ┌───┐
//      │ H │
//      │ E │
//      │ L │
//      │ L │
//      │ O │
//      └───┘
//           ↓
//   4. 좌우반전 적용 (scale -1,1)
//      ┌───┐
//      │ H │  (거울상)
//      │ E │
//      │ L │
//      │ L │
//      │ O │
//      └───┘
//           ↓
//   5. 둥근 모서리 (clip)
//      ╭───╮
//      │   │
//      ╰───╯
//           ↓
//   6. toDataURL → 결과!


// download 함수 핵심 포인트 설명
//  download 함수 설명할게요! 이건 짧고 간단해요.

//   전체 코드

//   const download = useCallback(() => {
//       if (!state.resultUrl) return;

//       const link = document.createElement('a');
//       link.href = state.resultUrl;
//       link.download = `converted.${state.format}`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//   }, [state.resultUrl, state.format]);

//   ---
//   단계별 설명

//   1. 결과 확인

//   if (!state.resultUrl) return;
//   - 변환된 이미지가 없으면 아무것도 안 함

//   ---
//   2. 가짜 링크 만들기

//   const link = document.createElement('a');
//   - HTML <a> 태그를 코드로 생성
//   - 화면에는 안 보임 (아직 추가 안 함)

//   ---
//   3. 링크 설정

//   link.href = state.resultUrl;
//   link.download = `converted.${state.format}`;
//   ┌──────────┬─────────────────────┬───────────────────────────┐
//   │   속성   │        설명         │           예시            │
//   ├──────────┼─────────────────────┼───────────────────────────┤
//   │ href     │ 다운로드할 파일 URL │ data:image/png;base64,... │
//   ├──────────┼─────────────────────┼───────────────────────────┤
//   │ download │ 저장될 파일명       │ converted.png             │
//   └──────────┴─────────────────────┴───────────────────────────┘
//   download 속성이 핵심!
//   <!-- download 속성 없음 → 브라우저에서 열림 -->
//   <a href="image.png">클릭</a>

//   <!-- download 속성 있음 → 파일로 다운로드됨 -->
//   <a href="image.png" download="my-image.png">클릭</a>

//   ---
//   4. 페이지에 추가

//   document.body.appendChild(link);
//   - 링크를 페이지에 붙임
//   - 일부 브라우저는 페이지에 있어야 클릭이 작동함

//   ---
//   5. 클릭 실행

//   link.click();
//   - 코드로 클릭 이벤트 발생
//   - 사용자가 클릭한 것처럼 동작
//   - → 다운로드 시작!

//   ---
//   6. 정리

//   document.body.removeChild(link);
//   - 사용 끝난 링크 제거
//   - 안 지우면 보이지 않는 <a> 태그가 계속 쌓임

//   ---
//   시각적 요약

//   1. <a> 태그 생성 (보이지 않음)

//   2. 설정
//      <a href="data:image/png;base64,..."
//         download="converted.png">

//   3. body에 추가
//      <body>
//        ...
//        <a>  ← 여기 추가됨
//      </body>

//   4. 클릭! → 다운로드 시작
//      💾 converted.png

//   5. <a> 태그 제거 (정리)

//   ---
//   비유로 이해하기

//   1. 종이에 다운로드 링크 적음 (createElement)
//   2. "이 파일이야" 주소 적음 (href)
//   3. "이 이름으로 저장해" 적음 (download)
//   4. 벽에 붙임 (appendChild)
//   5. 손가락으로 누름 (click)
//   6. 종이 떼서 버림 (removeChild)

//   ---
//   의존성 배열

//   }, [state.resultUrl, state.format]);
//   - resultUrl 또는 format이 바뀌면 함수 재생성
//   - 이 값들을 함수 안에서 사용하니까 의존성에 포함

//   ---
//   짧지만 브라우저 다운로드의 핵심 패턴이에요! 다른 프로젝트에서도 이 방식 그대로 쓸 수 있어요.