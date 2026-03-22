#!/usr/bin/env python3
"""
배경 제거 스크립트
/public/images/shares/ 폴더의 모든 PNG 이미지에서 배경을 제거합니다.
"""

import os
from pathlib import Path
from rembg import remove
from PIL import Image
from tqdm import tqdm

# 경로 설정
script_dir = Path(__file__).parent
shares_dir = script_dir / "public" / "images" / "shares"
backup_dir = script_dir / "public" / "images" / "shares_backup"

def remove_backgrounds():
    """모든 PNG 이미지의 배경을 제거합니다."""

    # shares 폴더 확인
    if not shares_dir.exists():
        print(f"❌ 폴더를 찾을 수 없습니다: {shares_dir}")
        return

    # PNG 파일 찾기
    png_files = list(shares_dir.glob("*.png"))

    if not png_files:
        print(f"❌ PNG 파일을 찾을 수 없습니다: {shares_dir}")
        return

    print(f"✅ {len(png_files)}개의 PNG 파일을 찾았습니다.")

    # 백업 폴더 생성
    backup_dir.mkdir(parents=True, exist_ok=True)
    print(f"📁 백업 폴더: {backup_dir}")

    # 각 파일 처리
    success_count = 0
    for png_file in tqdm(png_files, desc="배경 제거 중"):
        try:
            # 원본 이미지 열기
            with Image.open(png_file) as img:
                # 백업 저장
                backup_path = backup_dir / png_file.name
                img.save(backup_path)

                # 배경 제거
                output = remove(img)

                # 결과 저장 (원본 덮어쓰기)
                output.save(png_file)

                success_count += 1

        except Exception as e:
            print(f"❌ 오류 발생 ({png_file.name}): {e}")

    print(f"\n🎉 완료! {success_count}/{len(png_files)}개 파일 처리 완료")
    print(f"📦 원본 이미지는 백업 폴더에 저장되었습니다: {backup_dir}")

if __name__ == "__main__":
    print("=" * 60)
    print("🎨 배경 제거 스크립트 시작")
    print("=" * 60)
    remove_backgrounds()
    print("=" * 60)
