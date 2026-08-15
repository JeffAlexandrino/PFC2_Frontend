import { Button, OverlayTrigger } from "react-bootstrap";
import { OverlayFilterProps } from "../type";

export default function Filter({ isFiltered, trigger, placement, rootClose, ...props }: OverlayFilterProps) {
    return (
        <OverlayTrigger
            {...props}
            trigger={trigger ?? "click"}
            placement={placement ?? "bottom"}
            rootClose={rootClose ?? true}
        >
            <Button
                size="sm"
                data-test={"table-filter-button"}
                className={["table-action-button filter ", isFiltered && " active"].join(" ")}
            >
                <i className="bi bi-funnel fs-5 text-secondary-dark" />
            </Button>
        </OverlayTrigger>
    );
}
