export const getCropExpandAxis = (modifier, limits) => {
    let axis;

    if (
        (modifier === 'ml' && limits.toLeft) ||
        (modifier === 'mr' && limits.toRight)
    ) {
        axis = 'x';
    }

    if (
        (modifier === 'tc' && limits.toTop) ||
        (modifier === 'bc' && limits.toBottom)
    ) {
        axis = 'y';
    }

    return axis;
};

export const getExpandedSize = (target, rectHandler, axis) => {
    const { offsetRight, offsetBottom } = getOffsets(target.node, rectHandler.node);
    const offsetX = offsetRight > 0 ? offsetRight : 0;
    const offsetY = offsetBottom > 0 ? offsetBottom : 0;

    const ratio = target.width() / target.height();

    let width;
    let height;

    if (!axis || axis === 'x') {
        const w = target.node.getBoundingClientRect().width + offsetX;
        height = w / ratio;
    } else if (axis === 'y') {
        const h = target.node.getBoundingClientRect().height + offsetY;
        width = h * ratio;
    }

    return {
        w: width,
        h: height,
    };
};

export const getLimits = (target, rectHandler) => {
    const targetBCR = target.getBoundingClientRect();
    const rectHandlerBCR = rectHandler.getBoundingClientRect();

    return {
        toTop: rectHandlerBCR.y < targetBCR.y,
        toRight: rectHandlerBCR.x + rectHandlerBCR.width > targetBCR.x + targetBCR.width,
        toBottom: rectHandlerBCR.y + rectHandlerBCR.height > targetBCR.y + targetBCR.height,
        toLeft: rectHandlerBCR.x < targetBCR.x,
    };
};

export const getOffsets = (target, rectHandler) => {
    const targetBCR = target.getBoundingClientRect();
    const rectHandlerBCR = rectHandler.getBoundingClientRect();

    return {
        offsetTop: rectHandlerBCR.top - targetBCR.top, // Inside when positive value
        offsetRight: rectHandlerBCR.right - targetBCR.right, // Inside when positive value
        offsetBottom: rectHandlerBCR.bottom - targetBCR.bottom, // Inside when negative value
        offsetLeft: rectHandlerBCR.left - targetBCR.left, // Inside when negative values
    };
};