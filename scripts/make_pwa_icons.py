from PIL import Image, ImageDraw, ImageFont
import os

def create_pwa_icon(size: int, output_path: str):
    # 배경 생성
    img = Image.new("RGBA", (size, size), (15, 23, 42, 255)) # Slate 900
    draw = ImageDraw.Draw(img)
    
    # 둥근 라운딩 박스
    margin = int(size * 0.04)
    radius = int(size * 0.22)
    draw.rounded_rectangle(
        [(margin, margin), (size - margin, size - margin)],
        radius=radius,
        fill=(30, 41, 59, 255), # Slate 800
        outline=(51, 65, 85, 255), # Slate 700
        width=int(size * 0.015)
    )
    
    # 중앙 법률 기둥 (골드)
    col_w = int(size * 0.035)
    col_h = int(size * 0.45)
    center_x = size // 2
    top_y = int(size * 0.22)
    draw.rounded_rectangle(
        [(center_x - col_w // 2, top_y), (center_x + col_w // 2, top_y + col_h)],
        radius=col_w // 2,
        fill=(245, 158, 11, 255) # Amber 500
    )
    
    # 상단 천칭 받침대 (골드)
    beam_w = int(size * 0.52)
    beam_h = int(size * 0.025)
    beam_y = top_y + int(col_h * 0.15)
    draw.rounded_rectangle(
        [(center_x - beam_w // 2, beam_y), (center_x + beam_w // 2, beam_y + beam_h)],
        radius=beam_h // 2,
        fill=(245, 158, 11, 255)
    )
    
    # 저울 접시 (좌측: 블루 인정 / 우측: 앰버 부정)
    dish_radius = int(size * 0.09)
    # 좌측
    left_x = center_x - beam_w // 2 + int(size * 0.04)
    left_y = beam_y + int(size * 0.16)
    draw.line([(left_x, beam_y + beam_h), (left_x - int(size * 0.05), left_y)], fill=(245, 158, 11, 255), width=2)
    draw.line([(left_x, beam_y + beam_h), (left_x + int(size * 0.05), left_y)], fill=(245, 158, 11, 255), width=2)
    draw.chord([(left_x - dish_radius, left_y - dish_radius // 2), (left_x + dish_radius, left_y + dish_radius)], 0, 180, fill=(37, 99, 235, 255))
    
    # 우측
    right_x = center_x + beam_w // 2 - int(size * 0.04)
    right_y = beam_y + int(size * 0.13)
    draw.line([(right_x, beam_y + beam_h), (right_x - int(size * 0.05), right_y)], fill=(245, 158, 11, 255), width=2)
    draw.line([(right_x, beam_y + beam_h), (right_x + int(size * 0.05), right_y)], fill=(245, 158, 11, 255), width=2)
    draw.chord([(right_x - dish_radius, right_y - dish_radius // 2), (right_x + dish_radius, right_y + dish_radius)], 0, 180, fill=(217, 119, 6, 255))
    
    # 하단 2027 블루 캡슐
    cap_w = int(size * 0.38)
    cap_h = int(size * 0.11)
    cap_y = int(size * 0.76)
    draw.rounded_rectangle(
        [(center_x - cap_w // 2, cap_y), (center_x + cap_w // 2, cap_y + cap_h)],
        radius=cap_h // 2,
        fill=(37, 99, 235, 255) # Blue 600
    )
    
    # 텍스트 시도
    try:
        font = ImageFont.truetype("arial.ttf", int(size * 0.065))
        draw.text((center_x, cap_y + cap_h // 2), "2027", fill=(255, 255, 255, 255), anchor="mm", font=font)
    except:
        pass
        
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, "PNG")
    print(f"[OK] Generated {output_path} ({size}x{size})")

if __name__ == "__main__":
    out_dir = r"e:\workspace\형사소송법\public\icons"
    create_pwa_icon(192, os.path.join(out_dir, "icon-192.png"))
    create_pwa_icon(512, os.path.join(out_dir, "icon-512.png"))
    create_pwa_icon(180, os.path.join(out_dir, "apple-touch-icon.png"))
