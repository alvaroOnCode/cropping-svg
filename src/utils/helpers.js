export const calcImageSize = (img, rectHandler, dir) => {
  const ratio = img.width() / img.height();

  let width;
  let height;

  if (!dir || dir === 'h') {
    const w = rectHandler.width() * rectHandler.transform().scaleX;
    width = w > img.width() ? w : img.width();

    height = width / ratio;
  } else if (dir === 'v') {
    const h = rectHandler.height() * rectHandler.transform().scaleY;
    height = h > img.height() ? h : img.height();

    width = height * ratio;
  }

  return {
    w: width,
    h: height,
  };
};

export const checkLimits = (border, inner) => {
  const borderBCR = border.getBoundingClientRect();
  const innerBCR = inner.getBoundingClientRect();

  return {
    toTop: innerBCR.y <= borderBCR.y,
    toRight: innerBCR.x + innerBCR.width >= borderBCR.x + borderBCR.width,
    toBottom: innerBCR.y + innerBCR.height >= borderBCR.y + borderBCR.height,
    toLeft: innerBCR.x <= borderBCR.x,
  };
};