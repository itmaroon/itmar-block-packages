interface GridCell {
    rowInx: number;
    colInx: number;
}
interface GridElement {
    startCell: GridCell;
    endCell: GridCell;
    value?: string;
    [key: string]: any;
}
export interface GridAttributes {
    gridElms: GridElement[];
    rowNum: number;
    colNum: number;
    rowGap: string | number;
    colGap: string | number;
    rowUnit: string[];
    colUnit: string[];
    [key: string]: any;
}
interface GridControlsProps {
    attributes: GridAttributes;
    clientId: string;
    onChange: (newAttrs: Partial<GridAttributes>) => void;
}
declare const GridControls: ({ attributes, clientId, onChange, }: GridControlsProps) => JSX.Element;
export default GridControls;
