#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
공유용 이미지 생성 스크립트
각 유형의 이미지에 별명, 서브타이틀, 특징을 텍스트로 추가합니다.
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os
import re

# 유형별 데이터
results_data = [
    {
        "type": "VSAT",
        "title": "폭주기관차 토끼",
        "subtitle": "보고, 지르고, 실험하고 — 잠은 나중에",
        "description": "눈으로 직접 확인되는 확실한 자극을 사랑하는 비주얼 중독자."
    },
    {
        "type": "VSAN",
        "title": "본능 저격수 여우",
        "subtitle": "직감이 곧 법이다, 손끝이 곧 무기다",
        "description": "썸네일만 보고도 직감적으로 \"이거다!\" 싶으면 바로 달립니다."
    },
    {
        "type": "VSRT",
        "title": "명작 컬렉터 부엉이",
        "subtitle": "검증된 명작, 최신 장비, 완벽한 루틴",
        "description": "나만의 확고한 취향. 수년 전 저장된 \"구관이 명관\" 리스트 멤버십 회원."
    },
    {
        "type": "VSRN",
        "title": "프로 효율러 고양이",
        "subtitle": "화면 하나, 손 하나, 그걸로 충분하다",
        "description": "내가 가장 사랑하는 픽, 즐겨 찾는 특정 채널만 주구장창 파고듭니다."
    },
    {
        "type": "VMAT",
        "title": "방구석 무드디렉터 베어",
        "subtitle": "세팅 1시간, 본게임 2시간, 후회 0시간",
        "description": "온갖 조명, 향기, 젤, 진동 기구까지 모든 세팅이 완벽해야 출항합니다."
    },
    {
        "type": "VMAN",
        "title": "도파민 서퍼 미어캣",
        "subtitle": "고르는 재미가 반, 감상이 나머지 반",
        "description": "모니터에 수많은 탭을 띄워 놓고 한 편의 작품을 고르듯 아주 신중합니다."
    },
    {
        "type": "VMRT",
        "title": "침대 위 미식가 펭귄",
        "subtitle": "같은 명작도 새 장비면 새 경험이니까",
        "description": "내가 가장 사랑하는 \"클래식 명작\"을 띄우며 경건하게 사전 준비를 합니다."
    },
    {
        "type": "VMRN",
        "title": "사골국 순정 판다",
        "subtitle": "조용히, 천천히, 나만의 속도로",
        "description": "항상 보던 \"그 영상\"을 틀어두면 마음의 평화와 이너피스(Inner Peace)가 찾아옵니다."
    },
    {
        "type": "FSAT",
        "title": "풀착장 우주 퍼그",
        "subtitle": "상상은 빠르게, 실행은 더 빠르게",
        "description": "텍스트, 오디오 혹은 순수한 뇌내 망상만으로도 충분히 에베레스트 정상에 오릅니다."
    },
    {
        "type": "FSAN",
        "title": "전두엽 풀악셀 치타",
        "subtitle": "머릿속 시나리오가 곧 최고의 콘텐츠",
        "description": "화려한 영상보다 나의 톡톡 튀는 19금 상상력 한 번이 100배 더 짜릿합니다."
    },
    {
        "type": "FSRT",
        "title": "템빨 마법사 댕댕이",
        "subtitle": "뇌내 극장은 언제나 같은 명작을 상영 중",
        "description": "언제나 마음속 한편엔 \"가장 완벽한 그 상황\"이라는 나만의 치트키 망상을 품고 있습니다."
    },
    {
        "type": "FSRN",
        "title": "자연인 몽상가 나무늘보",
        "subtitle": "고요한 밤, 깊은 상상, 완벽한 루틴",
        "description": "내 머릿속 데이터센터에는 나만을 위한 최고의 시나리오가 저장되어 있습니다."
    },
    {
        "type": "FMAT",
        "title": "세계관 창조주 고양이",
        "subtitle": "눈 감으면 펼쳐지는 나만의 대서사시",
        "description": "머릿속 판타지와 복잡한 상황극을 현실로 끌어오기 위해 방을 수상한 아이템들로 도배합니다."
    },
    {
        "type": "FMAN",
        "title": "무한리필 몽상가 햄스터",
        "subtitle": "이야기의 끝이 보이지 않는 밤이 좋다",
        "description": "눈을 감고 상상의 늪에 빠지면 두 시간도 모자랍니다. 침대가 우주선이 된 기분이죠."
    },
    {
        "type": "FMRT",
        "title": "망상 끝판왕 사자",
        "subtitle": "매일 같은 판타지, 매일 같은 행복",
        "description": "수백 번을 돌려 상상해 본 \"나만의 완벽한 시나리오\"를 마치 어제 본 것처럼 또 음미합니다."
    },
    {
        "type": "FMRN",
        "title": "슬로우 모션 거북이",
        "subtitle": "상상만으로 충분한 밤의 미니멀리스트",
        "description": "모니터나 자극적인 도구가 굳이 왜 필요한가? 나에게는 무적의 상상력과 소나무 같은 취향이 있는데."
    }
]

def remove_markdown(text):
    """마크다운 **bold** 제거"""
    return re.sub(r'\*\*(.*?)\*\*', r'\1', text)

def get_font(size, bold=False):
    """한글 폰트 가져오기"""
    font_paths = [
        # macOS - AppleSDGothicNeo (세련된 시스템 폰트)
        "/System/Library/Fonts/AppleSDGothicNeo.ttc",
        "/Library/Fonts/AppleSDGothicNeo.ttc",
        # 나눔고딕
        "/Library/Fonts/NanumGothic.otf",
        "/System/Library/Fonts/Supplemental/AppleGothic.ttf",
    ]

    for font_path in font_paths:
        if os.path.exists(font_path):
            try:
                # ttc 파일의 경우 index 지정 (Bold는 5번 인덱스)
                if font_path.endswith('.ttc'):
                    index = 5 if bold else 0  # AppleSDGothicNeo Bold
                    return ImageFont.truetype(font_path, size, index=index)
                else:
                    return ImageFont.truetype(font_path, size)
            except Exception as e:
                continue

    # 폴백: 기본 폰트
    return ImageFont.load_default()

def create_share_image(result_data, input_dir, output_dir):
    """공유 이미지 생성"""
    type_code = result_data["type"]
    title = result_data["title"]
    subtitle = result_data["subtitle"]
    description = remove_markdown(result_data["description"])

    # 원본 이미지 열기
    input_path = os.path.join(input_dir, f"{type_code}.png")
    if not os.path.exists(input_path):
        print(f"⚠️  {type_code}.png 파일을 찾을 수 없습니다.")
        return

    img = Image.open(input_path).convert("RGBA")
    width, height = img.size

    # 새 캔버스 생성 (더 큰 크기)
    new_height = height + 350  # 텍스트 공간 추가
    canvas = Image.new("RGBA", (width, new_height), (15, 23, 42, 255))  # 어두운 배경

    # 원본 이미지를 상단에 배치
    canvas.paste(img, (0, 0))

    # 그라데이션 오버레이 생성 (이미지 하단부터 텍스트 영역까지)
    gradient = Image.new("RGBA", (width, 450), (0, 0, 0, 0))
    draw_gradient = ImageDraw.Draw(gradient)

    for i in range(450):
        alpha = int((i / 450) * 220)  # 0 -> 220
        draw_gradient.rectangle(
            [(0, i), (width, i + 1)],
            fill=(15, 23, 42, alpha)
        )

    # 그라데이션을 이미지 하단에 합성
    canvas.paste(gradient, (0, height - 100), gradient)

    # 텍스트 영역에 배경색
    draw = ImageDraw.Draw(canvas)
    draw.rectangle(
        [(0, height), (width, new_height)],
        fill=(15, 23, 42, 255)
    )

    # 폰트 로드
    font_title = get_font(70, bold=True)      # 큰 제목 (Bold)
    font_subtitle = get_font(36, bold=False)  # 서브타이틀
    font_desc = get_font(24, bold=False)      # 설명
    font_icon = get_font(28, bold=False)      # 아이콘용

    # 텍스트 그리기
    y_offset = height + 30

    # 1. 큰 제목 (별명)
    title_bbox = draw.textbbox((0, 0), title, font=font_title)
    title_width = title_bbox[2] - title_bbox[0]
    title_x = (width - title_width) // 2

    # 네온 효과 (그림자)
    for offset in [(2, 2), (-2, -2), (2, -2), (-2, 2)]:
        draw.text(
            (title_x + offset[0], y_offset + offset[1]),
            title,
            font=font_title,
            fill=(168, 85, 247, 100)  # 보라색 그림자
        )

    draw.text((title_x, y_offset), title, font=font_title, fill=(255, 255, 255, 255))
    y_offset += 80

    # 2. 서브타이틀
    subtitle_bbox = draw.textbbox((0, 0), f'"{subtitle}"', font=font_subtitle)
    subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
    subtitle_x = (width - subtitle_width) // 2

    draw.text(
        (subtitle_x, y_offset),
        f'"{subtitle}"',
        font=font_subtitle,
        fill=(236, 72, 153, 255)  # 핑크색
    )
    y_offset += 60

    # 3. 구분선
    line_width = 200
    line_x = (width - line_width) // 2
    draw.rectangle(
        [(line_x, y_offset), (line_x + line_width, y_offset + 2)],
        fill=(168, 85, 247, 128)
    )
    y_offset += 30

    # 4. 특징 (description)
    # 텍스트를 여러 줄로 나누기
    max_width = width - 80
    lines = []
    words = description.split()
    current_line = ""

    for word in words:
        test_line = current_line + word + " "
        bbox = draw.textbbox((0, 0), test_line, font=font_desc)
        if bbox[2] - bbox[0] <= max_width:
            current_line = test_line
        else:
            if current_line:
                lines.append(current_line.strip())
            current_line = word + " "

    if current_line:
        lines.append(current_line.strip())

    # 각 줄 그리기
    for line in lines:
        line_bbox = draw.textbbox((0, 0), line, font=font_desc)
        line_width = line_bbox[2] - line_bbox[0]
        line_x = (width - line_width) // 2

        # 아이콘 (원형 불릿)
        draw.ellipse(
            [(50, y_offset + 8), (58, y_offset + 16)],
            fill=(168, 85, 247, 255)
        )

        draw.text(
            (line_x, y_offset),
            line,
            font=font_desc,
            fill=(209, 213, 219, 255)  # 연한 회색
        )
        y_offset += 38

    # RGB로 변환 후 저장
    output_path = os.path.join(output_dir, f"{type_code}.png")
    canvas_rgb = canvas.convert("RGB")
    canvas_rgb.save(output_path, "PNG", quality=95, optimize=True)

    print(f"✅ {type_code}.png 생성 완료!")

def main():
    """메인 함수"""
    # 경로 설정
    base_dir = os.path.dirname(os.path.abspath(__file__))
    input_dir = os.path.join(base_dir, "public", "images", "shares")
    output_dir = os.path.join(base_dir, "public", "images", "shares_new")

    # 출력 디렉토리 생성
    os.makedirs(output_dir, exist_ok=True)

    print("🎨 공유 이미지 생성 시작...\n")

    # 각 유형별로 이미지 생성
    for result in results_data:
        create_share_image(result, input_dir, output_dir)

    print(f"\n✨ 모든 이미지 생성 완료!")
    print(f"📁 출력 위치: {output_dir}")
    print(f"\n💡 확인 후 만족스러우면:")
    print(f"   mv {output_dir}/* {input_dir}/")

if __name__ == "__main__":
    main()
