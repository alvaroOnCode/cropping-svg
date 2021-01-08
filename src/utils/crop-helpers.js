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
    const ratio = target.width() / target.height();

    let { width, height } = target.node.getBoundingClientRect();

    if (axis === 'x') {
        width += offsetRight > 0 ? offsetRight : 0;
        height = width / ratio;
    }

    if (axis === 'y') {
        height += offsetBottom > 0 ? offsetBottom : 0;
        width = height * ratio;
    }

    return {
        width,
        height,
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