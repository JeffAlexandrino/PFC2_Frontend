import { Card, ProgressBar } from "react-bootstrap";
import { CurrencyType } from "../../types/commom";
import { TargetType } from "../../types/target";

import utils from "../../utils";

export default function MetaCardVendedor({
    periodoMeta,
    targetTypeSelected,
    nowMeta,
    targetNowStr,
    acceleratorTriggerValue,
    commissionTriggerValue,
    achivedValue,
    ...restProps
}: {
    periodoMeta: any;
    targetTypeSelected: TargetType;
    CurrencyType: any;
    nowMeta: number;
    targetNowStr: string;
    commissionTriggerValue: number;
    acceleratorTriggerValue: number;
    achivedValue: number;
    isMonetaryTarget: boolean;
    children?: React.ReactNode;
}) {
    const commissionTriggerValuePercent = (commissionTriggerValue / acceleratorTriggerValue) * 100;

    const valorAbaixoMin = nowMeta < commissionTriggerValuePercent ? nowMeta : commissionTriggerValuePercent;
    const valorAcimaMin =
        nowMeta > commissionTriggerValuePercent && nowMeta < 100
            ? nowMeta - commissionTriggerValuePercent
            : nowMeta > 100
              ? 100 - commissionTriggerValuePercent
              : 0;
    const valorAcimaMeta = nowMeta > 100 ? nowMeta - 100 : 0;

    const valorAbaixoMinPercent = valorAbaixoMin.toFixed(2) + "%";
    const valorAcimaMinPercent = valorAcimaMin.toFixed(2) + "%";
    const valorAcimaMetaPercent = valorAcimaMeta.toFixed(2) + "%";

    return (
        <Card key={periodoMeta}>
            <Card.Header>{periodoMeta}</Card.Header>
            <Card.Body>
                <Card.Title>Meta {utils.retornaTextoTipoMeta(targetTypeSelected)}</Card.Title>
                <ProgressBar style={{ height: "2rem", fontSize: "1.1rem" }}>
                    <ProgressBar
                        style={valorAbaixoMin ? { minWidth: "4rem" } : undefined}
                        variant="danger"
                        now={valorAbaixoMin ? valorAbaixoMin : 0}
                        key={1}
                        label={valorAbaixoMinPercent}
                        animated={true}
                    />
                    <ProgressBar
                        style={valorAcimaMin ? { minWidth: "4rem" } : undefined}
                        variant={targetTypeSelected.includes("FATURAMENTO") ? "warning" : "primary"}
                        now={valorAcimaMin}
                        key={2}
                        label={valorAcimaMinPercent}
                        animated={true}
                    />
                    <ProgressBar
                        variant="success"
                        now={valorAcimaMeta}
                        key={3}
                        label={valorAcimaMetaPercent}
                        animated={true}
                    />
                </ProgressBar>

                <footer style={{ fontSize: "1.375rem" }} className="d-flex justify-content-between">
                    <small className="text-secondary-dark text-begin">
                        Min: {!commissionTriggerValue ? 0 : commissionTriggerValuePercent.toFixed(2) + "%"}
                    </small>

                    {restProps.isMonetaryTarget ? (
                        <small className="text-secondary-dark text-end">
                            {utils.retornaValorMonetario(achivedValue, CurrencyType.BRL)}/
                            {utils.retornaValorMonetario(acceleratorTriggerValue, CurrencyType.BRL)}
                        </small>
                    ) : (
                        <small className="text-secondary-dark text-end">
                            {achivedValue}/{acceleratorTriggerValue}
                        </small>
                    )}
                </footer>
            </Card.Body>
            {restProps.children}
        </Card>
    );
}
