class SquircleClass {
  static get contextOptions() {
    return { alpha: true };
  }

  static get inputProperties() {
    return [
      '--squircle-radius',
      '--squircle-border-width',
      '--squircle-border-color',
      '--squircle-smooth',
      '--squircle-background-color',
    ];
  }

  paint(ctx: any, geom: { width: number, height: number }, properties: any) {
    const radius = (getSingleProp(properties, '--squircle-radius', 'int') ?? 0) * 1.8
    const radiuses = [radius, radius, radius, radius]
    const minRadius = Math.min(geom.width / 2, geom.height / 2);

    draw({
      ctx,
      width: geom.width,
      height: geom.height,
      radiuses: radius < geom.width / 2 && radius < geom.height / 2
        ? radiuses
        : radiuses.map(() => minRadius),
      smooth: Math.max(1, getSingleProp(properties, '--squircle-smooth', 'float') ?? 1 * 10),
      borderWidth: getSingleProp(properties, '--squircle-border-width', 'int') ?? 0,
      borderColor: getSingleProp(properties, '--squircle-border-color', 'string'),
      backgroundColor: getSingleProp(properties, '--squircle-background-color', 'string') ?? '#f00',
    });
  }
}

registerPaint?.('squircle', SquircleClass);

function getSingleProp(properties: any, name: string, type: 'string' | 'int' | 'float') {
  const prop = properties.get(name)
  if (prop.length === 0) {
    return null
  }

  if (type === 'int') {
    return parseInt(prop, 10)
  }

  if (type === 'float') {
    return parseFloat(prop)
  }

  return prop.toString()
}


function draw(opts: { ctx: any, width: number, height: number, radiuses: number[], smooth: number, borderWidth: number, borderColor: string | null, backgroundColor: string }) {
  const {ctx, width, height, radiuses, smooth, borderWidth, borderColor, backgroundColor} = opts;

  const lineWidthOffset = borderWidth / 2;
  // OPEN LEFT-TOP CORNER
  ctx.beginPath();
  ctx.lineTo(radiuses[0], lineWidthOffset);
  // TOP-RIGHT CORNER
  ctx.lineTo(width - radiuses[1], lineWidthOffset);
  ctx.bezierCurveTo(
    width - radiuses[1] / smooth,
    lineWidthOffset, // first bezier point
    width - lineWidthOffset,
    radiuses[1] / smooth, // second bezier point
    width - lineWidthOffset,
    radiuses[1], // last connect point
  );
  // BOTTOM-RIGHT CORNER
  ctx.lineTo(width - lineWidthOffset, height - radiuses[2]);
  ctx.bezierCurveTo(
    width - lineWidthOffset,
    height - radiuses[2] / smooth, // first bezier point
    width - radiuses[2] / smooth,
    height - lineWidthOffset, // second bezier point
    width - radiuses[2],
    height - lineWidthOffset, // last connect point
  );
  // BOTTOM-LEFT CORNER
  ctx.lineTo(radiuses[3], height - lineWidthOffset);
  ctx.bezierCurveTo(
    radiuses[3] / smooth,
    height - lineWidthOffset, // first bezier point
    lineWidthOffset,
    height - radiuses[3] / smooth, // second bezier point
    lineWidthOffset,
    height - radiuses[3], // last connect point
  );
  // CLOSE LEFT-TOP CORNER
  ctx.lineTo(lineWidthOffset, radiuses[0]);
  ctx.bezierCurveTo(
    lineWidthOffset,
    radiuses[0] / smooth, // first bezier point
    radiuses[0] / smooth,
    lineWidthOffset, // second bezier point
    radiuses[0],
    lineWidthOffset, // last connect point
  );
  ctx.closePath();

  if (borderWidth && borderColor) {
    ctx.strokeStyle = borderColor
    ctx.lineWidth = borderWidth
    ctx.stroke()
  }

  ctx.fillStyle = backgroundColor;
  ctx.fill();
};
