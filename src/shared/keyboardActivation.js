export function preventRepeatedActivation(event) {
  if (!event.repeat || !["Enter", " "].includes(event.key)) return;
  const button = event.target.closest?.("button, summary");
  // O direcional tem sua própria repetição, igual às setas e ao toque.
  if (button && !button.closest(".field-dpad")) event.preventDefault();
}
