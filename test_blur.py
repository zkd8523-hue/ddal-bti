#!/usr/bin/env python3
"""테스트: FMAT.png 한 장만 블러 처리"""

from PIL import Image, ImageFilter
from rembg import remove

# 설정
input_path = 'public/images/shares_backup/FMAT.png'
output_path = 'public/images/shares/FMAT_blur_test.png'
blur_radius = 25

print(f"입력: {input_path}")
print(f"출력: {output_path}")
print(f"블러 강도: {blur_radius}\n")

# 원본 이미지 로드
original = Image.open(input_path).convert('RGBA')
print(f"✓ 원본 이미지 로드: {original.size}")

# 배경 제거 (알파 채널로 마스크 생성)
print("AI로 배경/전경 분리 중...")
output = remove(original)

# 알파 채널을 마스크로 추출
mask = output.split()[3]  # RGBA의 A 채널
print("✓ 마스크 생성 완료")

# 배경 블러 처리
print(f"배경 블러 처리 중 (강도: {blur_radius})...")
blurred = original.convert('RGB').filter(ImageFilter.GaussianBlur(blur_radius))
blurred = blurred.convert('RGBA')

# 원본 RGB 채널 추출
original_rgb = original.convert('RGB')

# 마스크를 사용하여 합성 (전경은 선명하게, 배경은 블러)
result = Image.composite(original_rgb, blurred, mask)

# 저장
result.save(output_path, 'PNG')
print(f"✓ 저장 완료: {output_path}\n")

# 파일 크기 비교
import os
original_size = os.path.getsize(input_path) / 1024
result_size = os.path.getsize(output_path) / 1024
print(f"원본 크기: {original_size:.1f} KB")
print(f"결과 크기: {result_size:.1f} KB")
print("\n결과를 확인하신 후, 괜찮으면 전체 이미지를 처리하겠습니다!")
