import { ContextUser } from "../../contexts/ContextUser";
import { Placeholder, Stack } from "react-bootstrap";
import { ReactNode, useContext } from "react";

import "./styles.css";

interface ILayoutInfoBodyLeftProps {
    children?: ReactNode;
    carregando?: boolean;
}

export default function LayoutInfoBodyLeft(props: ILayoutInfoBodyLeftProps) {
    //CONTEXTOS
    const { carregandoUsuario } = useContext(ContextUser);

    return (
        <div className="my-div-lib-left d-flex border-end overflow-auto">
            {props.carregando || carregandoUsuario ? (
                <Stack className="mt-3 gap-2">
                    <Placeholder as="small" className="opacity-25" animation="glow">
                        <Placeholder sm="12" className="rounded" />
                    </Placeholder>
                    <Placeholder as="small" className="opacity-25" animation="glow">
                        <Placeholder sm="6" className="rounded" />
                    </Placeholder>
                    <Placeholder as="small" className="opacity-25" animation="glow">
                        <Placeholder sm="6" className="rounded" />
                    </Placeholder>
                    <Placeholder as="small" className="opacity-25" animation="glow">
                        <Placeholder sm="6" className="rounded" />
                    </Placeholder>
                    <Placeholder as="small" className="opacity-25" animation="glow">
                        <Placeholder sm="6" className="rounded" />
                    </Placeholder>
                </Stack>
            ) : (
                props.children
            )}
        </div>
    );
}
