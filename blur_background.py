#!/usr/bin/env python3
"""
배경 블러 처리 스크립트
원본 이미지에서 주요 객체는 선명하게 유지하고 배경만 흐리게 처리합니다.
"""

from PIL import Image, ImageFilter
import os
import sys

def blur_background_with_mask(input_path, output_path, blur_radius=20):
    """
    AI 기반으로 배경과 전경을 분리하여 배경만 블러 처리

    Args:
        input_path: 입력 이미지 경로
        output_path: 출력 이미지 경로
        blur_radius: 블러 강도 (기본값: 20)
    """
    try:
        from rembg import remove

        # 원본 이미지 로드
        original = Image.open(input_path).convert('RGBA')
        print(f"원본 이미지 로드: {original.size}")

        # 배경 제거 (알파 채널로 마스크 생성)
        output = remove(original)

        # 알파 채널을 마스크로 추출
        mask = output.split()[3]  # RGBA의 A 채널

        # 배경 블러 처리
        blurred = original.convert('RGB').filter(ImageFilter.GaussianBlur(blur_radius))
        blurred = blurred.convert('RGBA')

        # 원본 RGB 채널 추출
        original_rgb = original.convert('RGB')

        # 마스크를 사용하여 합성 (전경은 선명하게, 배경은 블러)
        result = Image.composite(original_rgb, blurred, mask)

        # 저장
        result.save(output_path, 'PNG')
        print(f"✓ 배경 블러 처리 완료: {output_path}")
        print(f"  블러 강도: {blur_radius}")

    except ImportError:
        print("⚠️  rembg 라이브러리가 설치되지 않았습니다.")
        print("설치 방법: pip install rembg")
        print("\n대신 간단한 중앙 보존 블러 방법을 사용합니다...\n")
        blur_background_simple(input_path, output_path, blur_radius)
    except Exception as e:
        print(f"❌ 오류 발생: {e}")
        sys.exit(1)

def blur_background_simple(input_path, output_path, blur_radius=20):
    """
    중앙 영역을 보존하고 가장자리를 블러 처리
    (AI 라이브러리 없이 간단하게 처리)

    Args:
        input_path: 입력 이미지 경로
        output_path: 출력 이미지 경로
        blur_radius: 블러 강도 (기본값: 20)
    """
    try:
        # 원본 이미지 로드
        original = Image.open(input_path).convert('RGBA')
        width, height = original.size
        print(f"원본 이미지 로드: {width}x{height}")

        # 배경 블러 처리
        blurred = original.filter(ImageFilter.GaussianBlur(blur_radius))

        # 중앙 영역 크기 계산 (원본의 60% 정도)
        center_width = int(width * 0.6)
        center_height = int(height * 0.6)
        left = (width - center_width) // 2
        top = (height - center_height) // 2

        # 그라데이션 마스크 생성
        mask = Image.new('L', (width, height), 0)

        # 중앙에서 가장자리로 갈수록 블러가 적용되도록
        from PIL import ImageDraw
        draw = ImageDraw.Draw(mask)

        # 여러 단계의 타원을 그려서 부드러운 그라데이션 생성
        steps = 50
        for i in range(steps):
            alpha = int(255 * (i / steps))
            scale = 1 - (i / steps) * 0.4  # 중앙은 1.0, 가장자리는 0.6

            ellipse_width = int(center_width * scale)
            ellipse_height = int(center_height * scale)
            ellipse_left = (width - ellipse_width) // 2
            ellipse_top = (height - ellipse_height) // 2

            draw.ellipse(
                [ellipse_left, ellipse_top,
                 ellipse_left + ellipse_width, ellipse_top + ellipse_height],
                fill=alpha
            )

        # 블러된 배경과 선명한 중앙을 합성
        result = Image.composite(original, blurred, mask)

        # 저장
        result.save(output_path, 'PNG')
        print(f"✓ 중앙 보존 블러 처리 완료: {output_path}")
        print(f"  블러 강도: {blur_radius}")

    except Exception as e:
        print(f"❌ 오류 발생: {e}")
        sys.exit(1)

def process_all_images(input_dir, output_dir, blur_radius=20, use_ai=True):
    """
    디렉토리 내의 모든 이미지를 처리

    Args:
        input_dir: 입력 디렉토리
        output_dir: 출력 디렉토리
        blur_radius: 블러 강도
        use_ai: AI 기반 처리 사용 여부
    """
    # 출력 디렉토리 생성
    os.makedirs(output_dir, exist_ok=True)

    # 지원하는 이미지 형식
    supported_formats = ('.png', '.jpg', '.jpeg', '.webp')

    # 이미지 파일 목록
    image_files = [f for f in os.listdir(input_dir)
                   if f.lower().endswith(supported_formats)]

    print(f"처리할 이미지: {len(image_files)}개\n")

    for i, filename in enumerate(image_files, 1):
        print(f"[{i}/{len(image_files)}] 처리 중: {filename}")
        input_path = os.path.join(input_dir, filename)
        output_path = os.path.join(output_dir, filename)

        if use_ai:
            blur_background_with_mask(input_path, output_path, blur_radius)
        else:
            blur_background_simple(input_path, output_path, blur_radius)
        print()

if __name__ == '__main__':
    # 설정
    INPUT_DIR = 'public/images/shares_backup'
    OUTPUT_DIR = 'public/images/shares'
    BLUR_RADIUS = 25  # 블러 강도 (15-30 권장)
    USE_AI = True  # AI 기반 처리 사용 여부

    print("=" * 60)
    print("배경 블러 처리 시작")
    print("=" * 60)
    print(f"입력: {INPUT_DIR}")
    print(f"출력: {OUTPUT_DIR}")
    print(f"블러 강도: {BLUR_RADIUS}")
    print(f"AI 모드: {'ON' if USE_AI else 'OFF'}")
    print("=" * 60)
    print()

    # 처리 시작
    process_all_images(INPUT_DIR, OUTPUT_DIR, BLUR_RADIUS, USE_AI)

    print("=" * 60)
    print("✓ 모든 이미지 처리 완료!")
    print("=" * 60)
