export function AboutWritingVisual() {
  return (
    <div className="about-visual" aria-hidden="true">
      <svg className="about-visual__svg" viewBox="0 0 720 480" focusable="false">
        <path className="about-visual__page" d="M72 42H494V368H72Z" />
        <path className="about-visual__fold" d="M434 42V102H494" />

        <g className="about-visual__prose">
          <path d="M120 118H350" />
          <path d="M120 158H424" />
          <path d="M120 198H386" />
          <path d="M120 238H430" />
          <path d="M120 278H318" />
        </g>

        <path className="about-visual__caret" d="M104 102V136" />
        <path className="about-visual__thread" d="M330 304C406 304 408 392 492 392" />

        <g className="about-visual__keys">
          <rect x="458" y="300" width="54" height="42" />
          <rect x="522" y="300" width="54" height="42" />
          <rect x="586" y="300" width="54" height="42" />
          <rect x="426" y="352" width="54" height="42" />
          <rect x="490" y="352" width="54" height="42" />
          <rect x="554" y="352" width="86" height="42" />
          <rect x="458" y="404" width="182" height="34" />
        </g>

        <g className="about-visual__marks">
          <circle cx="485" cy="321" r="4" />
          <circle cx="549" cy="321" r="4" />
          <circle cx="613" cy="321" r="4" />
          <circle cx="453" cy="373" r="4" />
          <circle cx="517" cy="373" r="4" />
          <path d="M580 373H614" />
        </g>
      </svg>
    </div>
  );
}
