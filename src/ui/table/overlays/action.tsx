import { Button, OverlayTrigger } from "react-bootstrap";
import { Filter } from "../filter-primitives";
import { OverlayActionProps } from "../type";
import { Popover } from "../popover";
import { useState } from "react";

export default function Action({ actions }: OverlayActionProps) {
    const [show, setShow] = useState(false);

    return (
        <OverlayTrigger
            rootClose
            trigger={"click"}
            onToggle={setShow}
            show={show}
            placement="left-start"
            overlay={
                <Popover.Root data-test="table-action-popover">
                    <Popover.Header>Escolha uma opção</Popover.Header>
                    <Popover.Body className="flex-column p-0 py-2">
                        {actions &&
                            actions.map((action) => (
                                <Filter.EnumButton
                                    key={action.actionDescription}
                                    onClick={() => {
                                        action.action();
                                        setShow(false);
                                    }}
                                >
                                    {action.actionDescription}
                                </Filter.EnumButton>
                            ))}
                    </Popover.Body>
                </Popover.Root>
            }
        >
            <Button data-test="table-action-button" className="table-action-button action" aria-label="Ações">
                <i className="bi bi-three-dots-vertical" />
            </Button>
        </OverlayTrigger>
    );
}
