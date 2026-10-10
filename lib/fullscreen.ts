export const openPresenter = () => window.open("/presenter", "terraform-presenter", "width=1400,height=860");

export function exitFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen();
}

export function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen?.();
}
