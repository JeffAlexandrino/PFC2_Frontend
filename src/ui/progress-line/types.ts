export type ProgressLineOrientation = "vertical" | "horizontal";

export type ProgressLineRootProps = React.ComponentProps<"section">;
export type ProgressLineListProps = React.ComponentProps<"ol"> & { orientation?: ProgressLineOrientation };
export type ProgressLineStepProps<TValue> = Omit<React.ComponentProps<"li">, "children" | "value"> & {
    children?: string;
    active?: boolean;
    completed?: boolean;
    value: TValue;
    onChangeValue?: (value: TValue) => void;
};
