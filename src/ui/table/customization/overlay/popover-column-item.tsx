import { InputCheckbox } from "../../../../components";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import cn from "../../../../utils/cn";

type PopoverColumnItemProps = {
    columnId: string;
    description: string;
    show: boolean;
    onChangeShow: (show: boolean) => void;
};

export default function PopoverColumnItem({ onChangeShow: setShow, ...props }: PopoverColumnItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: props.columnId,
    });

    const style = {
        cursor: "auto",
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            className={cn([
                "d-flex justify-content-between align-items-center px-3 text-nowrap",
                isDragging && "bg-primary bg-opacity-25",
            ])}
            ref={setNodeRef}
            style={style}
            {...attributes}
        >
            <InputCheckbox
                checked={props.show}
                onChangeChecked={setShow}
                label={props.description}
                id={props.columnId}
            />
            <div className="h-100" style={{ cursor: "grab" }}>
                <i className="bi bi-grip-horizontal" {...listeners} />
            </div>
        </div>
    );
}
