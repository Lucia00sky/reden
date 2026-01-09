// 이미지 업로드 컴포넌트

'use client';

  import { useCallback, useRef } from 'react';
  import { Card } from '@/components/ui/card';
  import { Button } from '@/components/ui/button';

  interface ImageUploaderProps {
    onFileSelect: (file: File) => void;
    currentFile: File | null;
  }

  export function ImageUploader({ onFileSelect, currentFile }: ImageUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    // 파일 유효성 검사
    const handleFile = useCallback((file: File) => {
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }
      onFileSelect(file);
    }, [onFileSelect]);

    // 파일 선택 (input)
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    };

    // 드래그 앤 드롭
    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    };

    // 클립보드 붙여넣기
    const handlePaste = (e: React.ClipboardEvent) => {
      const file = e.clipboardData.files[0];
      if (file) handleFile(file);
    };

    // 버튼 클릭 → input 클릭
    const handleButtonClick = () => {
      inputRef.current?.click();
    };

    return (
      <Card
        className="p-6 border-2 border-dashed border-gray-300 hover:border-green-500 transition cursor-pointer"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onPaste={handlePaste}
        tabIndex={0}
      >
        <div className="text-center">
          <div className="text-4xl mb-4">📁</div>

          {currentFile ? (
            <p className="text-green-600 font-medium mb-2">
              {currentFile.name}
            </p>
          ) : (
            <p className="text-gray-500 mb-2">
              이미지를 드래그하거나 클릭하세요
            </p>
          )}

          <p className="text-sm text-gray-400 mb-4">
            Ctrl+V로 붙여넣기도 가능해요
          </p>

          <Button onClick={handleButtonClick} variant="outline">
            파일 선택
          </Button>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      </Card>
    );
  }















// - 드래그 앤 드롭 영역 만들기
//   힌트: onDragOver, onDrop 이벤트 처리
//   힌트: e.preventDefault() 필수!
//   힌트: e.dataTransfer.files[0]으로 파일 가져오기




  
// - 파일 선택 버튼 (input type="file")
//   힌트: accept="image/*"로 이미지만 허용
//   힌트: input은 hidden, button 클릭시 input.click() 호출
  

// - 클립보드 붙여넣기 (보너스)
//   힌트: onPaste 이벤트, e.clipboardData.files[0]
  


// UI 구성:
// - 점선 테두리 박스
// - "이미지를 드래그하거나 클릭하세요" 텍스트
// - 파일 선택 버튼