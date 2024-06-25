export const roundNumber = (value: number): number => {
    return Math.round((value + Number.EPSILON) * 100) / 100;
};

export const clamp = (min: number, max: number, value: number) : number => {
    if (value >= min && value <= max) return value;

    if (value < min) return min;

    return max;
}
