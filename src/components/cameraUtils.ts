// Utilitaire pour capturer une photo via la webcam et retourner un objet File
export type CapturePhotoOptions = {
  width?: number;
  height?: number;
  mimeType?: string;
};

export async function capturePhoto(options: CapturePhotoOptions = {}): Promise<File | null> {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("Camera non supportée par ce navigateur.");
    return null;
  }
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  const video = document.createElement('video');
  video.style.position = "fixed";
  video.style.left = "-9999px"; // cache la vidéo
  document.body.appendChild(video);
  video.srcObject = stream;
  await video.play();
  await new Promise(resolve => {
    if (video.readyState >= 2) resolve(true);
    else video.onloadedmetadata = resolve;
  });
  const width = options.width || video.videoWidth;
  const height = options.height || video.videoHeight;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    stream.getTracks().forEach(t => t.stop());
    document.body.removeChild(video);
    return null;
  }
  ctx.drawImage(video, 0, 0, width, height);
  stream.getTracks().forEach(t => t.stop());
  document.body.removeChild(video);
  const mimeType = options.mimeType || 'image/jpeg';
  const blob: Blob = await new Promise(resolve => canvas.toBlob(blob => resolve(blob!), mimeType));
  return new File([blob], `historique_${Date.now()}.jpg`, { type: mimeType });
}