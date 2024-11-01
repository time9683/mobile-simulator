
// from cordinates and icon size, get the row and column
export function getRowAndColumn(x: number, y: number, iconSize: number): [number, number] {
    const row = Math.ceil(y / iconSize);
    const column = Math.ceil(x / iconSize);
    return [row, column];
}