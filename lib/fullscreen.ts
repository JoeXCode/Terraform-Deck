
export function exitFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen();
}

export function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen?.();
}
