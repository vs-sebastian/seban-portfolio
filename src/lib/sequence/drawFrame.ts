/**
 * Draw a frame with object-fit: cover. Does not clear the canvas first —
 * a full cover draw fully replaces the previous frame and avoids black flashes.
 */
export function drawFrameCover(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  img: HTMLImageElement
): boolean {
  if (!img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) {
    return false;
  }

  const canvasRatio = canvas.width / canvas.height;
  const imgRatio = img.naturalWidth / img.naturalHeight;

  let drawWidth: number;
  let drawHeight: number;
  let drawX: number;
  let drawY: number;

  if (canvasRatio > imgRatio) {
    drawWidth = canvas.width;
    drawHeight = canvas.width / imgRatio;
    drawX = 0;
    drawY = (canvas.height - drawHeight) / 2;
  } else {
    drawHeight = canvas.height;
    drawWidth = canvas.height * imgRatio;
    drawY = 0;
    drawX = (canvas.width - drawWidth) / 2;
  }

  ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  return true;
}
