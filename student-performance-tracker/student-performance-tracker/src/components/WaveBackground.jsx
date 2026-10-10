// Subtle animated waves fixed to the bottom of the screen.
// Each layer is an SVG twice as wide as the screen that slides left by 50%
// (see .wave-layer in index.css), which makes a seamless endless loop.

const WAVE_PATH =
  'M0,60 C180,0 540,120 720,60 C900,0 1260,120 1440,60 C1620,0 1980,120 2160,60 C2340,0 2700,120 2880,60 V120 H0 Z'

const layers = [
  { fill: 'fill-cyan-200/10', duration: '38s', reverse: false, height: 'h-32' },
  { fill: 'fill-cyan-300/15', duration: '26s', reverse: true, height: 'h-24' },
  { fill: 'fill-blue-300/20', duration: '18s', reverse: false, height: 'h-16' },
]

export default function WaveBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-0 left-0 z-0 h-32 w-full overflow-hidden"
    >
      {layers.map((layer, i) => (
        <div
          key={i}
          className={`wave-layer absolute bottom-0 left-0 w-[200%] ${layer.height}`}
          style={{
            animationDuration: layer.duration,
            animationDirection: layer.reverse ? 'reverse' : 'normal',
          }}
        >
          <svg
            viewBox="0 0 2880 120"
            preserveAspectRatio="none"
            className={`h-full w-full ${layer.fill}`}
          >
            <path d={WAVE_PATH} />
          </svg>
        </div>
      ))}
    </div>
  )
}
