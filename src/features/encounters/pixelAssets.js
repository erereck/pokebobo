const cache = new Map();
const tints = new WeakMap();
export function tintedPixelImage(image, rgb, amount) {
  const coefficient = Math.round(Math.max(0, Math.min(1, amount)) * 16);
  if (!coefficient) return image;
  let variants = tints.get(image);
  if (!variants) {
    variants = new Map();
    tints.set(image, variants);
  }
  const key = `${rgb}-${coefficient}`;
  if (!variants.has(key)) {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < pixels.data.length; i += 4)
      for (let c = 0; c < 3; c++) {
        const value =
          ((pixels.data[i + c] >> 3) * (16 - coefficient) +
            (rgb[c] >> 3) * coefficient) >>
          4;
        pixels.data[i + c] = (value << 3) | (value >> 2);
      }
    ctx.putImageData(pixels, 0, 0);
    variants.set(key, canvas);
  }
  return variants.get(key);
}
export const fieldAsset = (name) =>
  `${import.meta.env.BASE_URL}field/${name}.png`;
export function loadPixelImage(src) {
  if (!cache.has(src))
    cache.set(
      src,
      new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => {
          cache.delete(src);
          reject(
            new Error(
              "Não foi possível carregar a cena. Recarregue para tentar novamente.",
            ),
          );
        };
        image.src = src;
      }),
    );
  return cache.get(src);
}
