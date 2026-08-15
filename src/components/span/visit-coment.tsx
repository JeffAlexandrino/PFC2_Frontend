import SpanSpan from "../../ui/span-component/spanSpan"; //Span Genérico
import React from "react";

import { v4 } from "uuid";

export default function Coment(props: { coments?: string | null }) {
    const hasComments = !!props.coments;
    const textSpan = hasComments
        ? props.coments!.slice(0, 20) + (props.coments!.length > 20 ? "..." : "")
        : "Nenhum comentário";

    return (
        <SpanSpan
            spanTriggerContent={
                <span className={hasComments ? "bi bi-file-earmark-text" : "bi bi-x-circle"}>{textSpan}</span>
            }
            popoverHeader={
                <>
                    <i className="bi bi-chat-square-quote"></i> Comentário
                </>
            }
        >
            <div style={{ minWidth: "200px" }}>
                {hasComments ? (
                    props.coments!.split("\n").map((texto?: string) =>
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
                    <div className="p-2 text-center fw-semibold">Nenhum cometário registrado.</div>
                )}
            </div>
        </SpanSpan>
    );
}
