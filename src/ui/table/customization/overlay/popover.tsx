import { sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor } from "@dnd-kit/core";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { LOCAL_STORAGE_PREFIX_KEY, TableContext } from "../../constructor";
import { PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { forwardRef, useCallback, useContext } from "react";
import { Popover as TablePopover } from "../../popover";
import { Column, PopoverRootProps } from "../../type";

import PopoverColumnItem from "./popover-column-item";

export type CustomizationOverlayPopoverProps = Omit<PopoverRootProps, "children"> & {};

const Popover = forwardRef<HTMLDivElement, CustomizationOverlayPopoverProps>((props, ref) => {
    const { setColumns, setPopColumns, tableName, popColumns } = useContext(TableContext);

    const localStorageKey = LOCAL_STORAGE_PREFIX_KEY + tableName;

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const saveCustomizations = useCallback(
        (columns: Column<any>[]) => {
            const updatedCustomizationData = columns.map((column) => ({ columnId: column.id, hidden: column.hide }));
            localStorage.setItem(localStorageKey, JSON.stringify(updatedCustomizationData));
        },
        [localStorageKey]
    );
    // const ButtonResetActive = useCallback(() => {
    //     const resetColumns = popColumns.map((column) => ({
    //         ...column,
    //         hide: true,
    //     }));

    //     saveCustomizations(resetColumns);
    //     setColumns(resetColumns);
    //     setPopColumns(resetColumns);
    // }, [popColumns, saveCustomizations, setColumns, setPopColumns]);

    // const ChangeState = useMemo(() => {
    //     if (filterColumns) {
    //         ButtonResetActive();
    //     }
    // }, [ButtonResetActive, filterColumns]);

    const handleOnChangeShow = useCallback(
        (columnId: string, showState: boolean) => {
            const updatedColumns = popColumns.map((column) => ({
                ...column,
                hide: column.id === columnId ? !showState : column.hide,
            }));

            saveCustomizations(updatedColumns);
            setColumns(updatedColumns);
            setPopColumns(updatedColumns);
        },
        [popColumns, saveCustomizations, setColumns, setPopColumns]
    );

    // useEffect(() => {
    //     const syncedColumns = popColumns.map((col) => ({
    //         ...col,
    //         hide: !columns.some((visibleCol) => visibleCol.id === col.id),
    //     }));
    //     setPopColumns(syncedColumns);
    // });

    const handleOnDragEnd = useCallback(
        ({ active, over }: DragEndEvent) => {
            if (active.id !== over?.id) {
                const oldIndex = popColumns.findIndex(({ id: name }) => name === active.id);
                const newIndex = popColumns.findIndex(({ id: name }) => name === over?.id);
                const updatedColumns = arrayMove(popColumns, oldIndex, newIndex);

                saveCustomizations(updatedColumns);
                setColumns(updatedColumns);
                setPopColumns(updatedColumns);
            }
        },
        [setColumns, setPopColumns, popColumns, saveCustomizations]
    );

    const columnIsVisible = useCallback(
        (columnId: string) => {
            return popColumns.some((col) => col.id === columnId && !col.hide);
        },
        [popColumns]
    );

    return (
        <TablePopover.Root ref={ref} {...props}>
            <TablePopover.Body className="flex-column p-0 py-2">
                <TablePopover.Content className="flex-column p-0">
                    <DndContext
                        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleOnDragEnd}
                    >
                        <SortableContext
                            items={popColumns.map(({ id: name }) => name)}
                            strategy={verticalListSortingStrategy}
                        >
                            {popColumns.map((column) => (
                                <PopoverColumnItem
                                    key={column.id}
                                    description={column.headerCell}
                                    columnId={column.id}
                                    show={columnIsVisible(column.id)}
                                    onChangeShow={(newState) => handleOnChangeShow(column.id, newState)}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                </TablePopover.Content>
            </TablePopover.Body>
        </TablePopover.Root>
    );
});

export default Popover;
