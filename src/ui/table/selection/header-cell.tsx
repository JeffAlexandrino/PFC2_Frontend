import { InputCheckbox } from "../../../components";
import { SelectionHeaderCellProps } from "../type";
import "./styles.css";

export default function HeaderCell(props: SelectionHeaderCellProps) {
    return (
        <th className="th-selection-cell text-center pb-2 px-2">
            <InputCheckbox {...props} />
        </th>
    );
}
