import SpanSpan from "../../ui/span-component/spanSpan"; // Span Genérico
import React from "react";

import { v4 } from "uuid";

export default function ServicesObs(props: { observacao?: string | null }) {
    const temObservacao = !!props.observacao;
    const observacao = temObservacao
        ? props.observacao!.slice(0, 20) + (props.observacao!.length > 20 ? "..." : "")
        : "Nenhum cometário";

    return (
        <SpanSpan
            spanTriggerContent={
                <span className={temObservacao ? "bi bi-file-earmark-text" : "bi bi-x-circle"}>{observacao}</span>
            }
            popoverHeader={
                <>
                    <i className="bi bi-exclamation-circle"></i> Importante
                </>
            }
        >
            <div style={{ minWidth: "200px" }}>
                {temObservacao ? (
                    props.observacao!.split("\n").map((texto?: string) =>
                        !texto ? (
                            <br key={v4()} />
                        ) : (
                            <React.Fragment key={v4()}>
                                <span>{texto}</span>
                                <br />
                            </React.Fragment>
                        )
                    )
                ) : (
                    <span className="text-muted">
                        <i className="bi bi-x-circle" /> Nenhuma observação
                    </span>
                )}
            </div>
        </SpanSpan>
    );
}
