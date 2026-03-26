#!/usr/bin/env python3
"""
공유 이미지 색상 프로파일 수정 스크립트
X(트위터)에서 색감이 이상하게 보이는 문제를 해결합니다.
"""

from PIL import Image, ImageCms
import os
import sys

def add_srgb_profile(input_path, output_path=None):
    """
    이미지에 sRGB 색상 프로파일을 추가합니다.

    Args:
        input_path: 입력 이미지 경로
        output_path: 출력 이미지 경로 (None이면 덮어쓰기)
    """
    if output_path is None:
        output_path = input_path

    try:
        # 이미지 로드
        img = Image.open(input_path)

        # RGB 모드로 변환
        if img.mode != 'RGB':
            img = img.convert('RGB')

        # sRGB 프로파일 생성
        srgb_profile = ImageCms.createProfile("sRGB")

        # 현재 프로파일 확인
        if 'icc_profile' in img.info:
            print(f"  기존 프로파일 발견 - 제거 후 sRGB로 변환")
            # 기존 프로파일에서 sRGB로 변환
            img = ImageCms.profileToProfile(img,
                                           ImageCms.ImageCmsProfile(img.info['icc_profile']),
                                           srgb_profile,
                                           outputMode='RGB')

        # sRGB 프로파일을 임베드하여 저장
        img.save(output_path,
                'PNG',
                icc_profile=ImageCms.ImageCmsProfile(srgb_profile).tobytes(),
                optimize=True)

        print(f"✓ sRGB 프로파일 추가 완료: {os.path.basename(output_path)}")

    except Exception as e:
        print(f"❌ 오류 발생 ({os.path.basename(input_path)}): {e}")
        return False

    return True

def process_directory(input_dir):
    """
    디렉토리 내의 모든 PNG 이미지에 sRGB 프로파일 추가

    Args:
        input_dir: 입력 디렉토리
    """
    # PNG 파일 목록
    png_files = [f for f in os.listdir(input_dir) if f.lower().endswith('.png')]

    if not png_files:
        print(f"❌ {input_dir}에 PNG 파일이 없습니다.")
        return

    print(f"처리할 이미지: {len(png_files)}개\n")

    success_count = 0
    for i, filename in enumerate(png_files, 1):
        print(f"[{i}/{len(png_files)}] {filename}")
        input_path = os.path.join(input_dir, filename)

        if add_srgb_profile(input_path):
            success_count += 1

    print(f"\n✓ 완료: {success_count}/{len(png_files)}개 성공")

if __name__ == '__main__':
    # shares 디렉토리의 모든 이미지 처리
    SHARES_DIR = 'public/images/shares'

    print("=" * 60)
    print("공유 이미지 색상 프로파일 수정")
    print("=" * 60)
    print(f"대상 디렉토리: {SHARES_DIR}")
    print("작업: sRGB 프로파일 임베드")
    print("=" * 60)
    print()

    if not os.path.exists(SHARES_DIR):
        print(f"❌ 디렉토리가 존재하지 않습니다: {SHARES_DIR}")
        sys.exit(1)

    process_directory(SHARES_DIR)

    print("\n" + "=" * 60)
    print("✓ 모든 작업 완료!")
    print("=" * 60)
    print("\n💡 X(트위터)에서 색감이 정상적으로 보일 것입니다.")
    print("   변경사항을 확인하려면 배포 후 X 카드 캐시를 초기화하세요:")
    print("   https://cards-dev.twitter.com/validator")
