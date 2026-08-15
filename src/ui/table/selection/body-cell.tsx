import { InputCheckbox } from "../../../components";
import { SelectionBodyCellProps } from "../type";
import "./styles.css";

export default function BodyCell(props: SelectionBodyCellProps) {
    return (
        <td className="td-selection-cell text-center position-sticky px-2">
            <InputCheckbox {...props} />
        </td>
    );
}
