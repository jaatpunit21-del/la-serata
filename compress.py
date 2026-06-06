import os
import cv2

def compress_image(src_path, dest_path, max_width=1000, quality=75):
    if not os.path.exists(src_path):
        print(f"Skipping: {src_path} (not found)")
        return
    
    print(f"Processing: {src_path} ({os.path.getsize(src_path) / (1024*1024):.2f} MB)")
    
    # Read image
    img = cv2.imread(src_path)
    if img is None:
        print(f"Error: Could not read {src_path}")
        return
        
    h, w = img.shape[:2]
    
    # Resize if larger than max_width
    if w > max_width:
        new_w = max_width
        new_h = int(h * (max_width / w))
        img = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)
        print(f"  Resized from {w}x{h} to {new_w}x{new_h}")
        
    # Write as WebP
    success = cv2.imwrite(dest_path, img, [cv2.IMWRITE_WEBP_QUALITY, quality])
    if success:
        print(f"  Saved to: {dest_path} ({os.path.getsize(dest_path) / 1024:.2f} KB)")
    else:
        print(f"  Error: Could not save to {dest_path}")

def main():
    assets = [
        ("assets/book_nook.png", "assets/book_nook_mobile.webp"),
        ("assets/cheesy_pasta.png", "assets/cheesy_pasta_mobile.webp"),
        ("assets/gourmet_sub.png", "assets/gourmet_sub_mobile.webp"),
        ("assets/hero_background.png", "assets/hero_background_mobile.webp"),
        ("assets/tiramisu_shake.png", "assets/tiramisu_shake_mobile.webp"),
        ("assets/backgrounds/bg1.png", "assets/backgrounds/bg1_mobile.webp"),
        ("assets/backgrounds/bg2.png", "assets/backgrounds/bg2_mobile.webp"),
        ("assets/backgrounds/bg3.png", "assets/backgrounds/bg3_mobile.webp"),
        ("assets/backgrounds/bg4.png", "assets/backgrounds/bg4_mobile.webp"),
    ]
    
    for src, dest in assets:
        compress_image(src, dest)

if __name__ == "__main__":
    main()
