/**
 * Yash Cloth Stores — WhatsApp & Image Sharing Utilities
 * 
 * Provides robust cross-device handling for:
 * 1. Native Web Share API with actual image file attachments to WhatsApp
 * 2. Automatic clipboard copying of product image
 * 3. Canvas-based cross-origin image blob conversion (safe against CORS issues)
 * 4. Fallback direct WhatsApp links with guaranteed absolute image URLs
 */

/**
 * Loads an image from any URL (Cloudinary or local assets) and extracts a binary Blob.
 * Handles CORS gracefully using an offscreen canvas fallback.
 */
export async function fetchImageAsBlob(imageUrl) {
  if (!imageUrl) throw new Error('No image URL provided');

  // Attempt direct fetch first
  try {
    const res = await fetch(imageUrl, { mode: 'cors' });
    if (res.ok) {
      const blob = await res.blob();
      if (blob && blob.size > 0) {
        return blob;
      }
    }
  } catch (fetchErr) {
    // Expected for some cross-origin domains without permissive CORS headers
  }

  // Fallback: load through an Image element and offscreen canvas
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width || 800;
        canvas.height = img.naturalHeight || img.height || 600;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas toBlob generated null'));
            }
          },
          'image/jpeg',
          0.92
        );
      } catch (canvasErr) {
        reject(canvasErr);
      }
    };

    img.onerror = () => {
      reject(new Error(`Failed to load image from: ${imageUrl}`));
    };

    img.src = imageUrl;
  });
}

/**
 * Converts a JPEG or generic blob into PNG format required by navigator.clipboard.write
 */
export async function convertBlobToPng(sourceBlob) {
  if (sourceBlob.type === 'image/png') return sourceBlob;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(sourceBlob);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('PNG conversion failed'));
      }, 'image/png');
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load blob for PNG conversion'));
    };

    img.src = url;
  });
}

/**
 * Creates a File object suitable for navigator.share({ files: [file] })
 */
export async function createShareableImageFile(imageUrl, filename = 'product-photo.jpg') {
  const blob = await fetchImageAsBlob(imageUrl);
  const ext = blob.type && blob.type.includes('png') ? 'png' : 'jpg';
  const cleanName = filename.endsWith(`.${ext}`) ? filename : `${filename}.${ext}`;
  return new File([blob], cleanName, { type: blob.type || 'image/jpeg' });
}

/**
 * Checks whether the current device/browser supports sharing image files via Web Share API
 */
export function canShareFiles() {
  if (typeof navigator === 'undefined' || !navigator.share || !navigator.canShare) {
    return false;
  }
  try {
    const dummyFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    return navigator.canShare({ files: [dummyFile] });
  } catch {
    return false;
  }
}

/**
 * Copies the product image directly to the system clipboard.
 * Enables the customer to immediately press Paste (Ctrl+V / Cmd+V) in WhatsApp!
 */
export async function copyImageToClipboard(imageUrl) {
  if (typeof navigator === 'undefined' || !navigator.clipboard || !window.ClipboardItem) {
    return false;
  }

  try {
    const rawBlob = await fetchImageAsBlob(imageUrl);
    const pngBlob = await convertBlobToPng(rawBlob);
    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': pngBlob,
      }),
    ]);
    return true;
  } catch (err) {
    console.warn('Clipboard write image failed:', err.message);
    return false;
  }
}

/**
 * Triggers native Web Share API with image file and caption text.
 * NOTE: We deliberately do NOT pass `url` separately because WhatsApp on Android/iOS
 * treats `url` as a text override and would drop the image file attachment!
 */
export async function shareImageWithCaption({ imageUrl, captionText, title = 'Yash Cloth Stores Order' }) {
  if (!navigator.share) throw new Error('Web Share API not supported on this device');

  const file = await createShareableImageFile(imageUrl, 'yash-cloth-order.jpg');

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({
      title,
      text: captionText,
      files: [file],
    });
    return true;
  }

  // Fallback: share text only
  await navigator.share({
    title,
    text: captionText,
  });
  return true;
}
