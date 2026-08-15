import { ProgressLineStepProps } from "./types";
import { Button } from "react-bootstrap";
import { useId } from "react";

import cn from "../../utils/cn";

import "./styles.css";

export default function Step<TValue>({
    className,
    active,
    children,
    completed,
    onChangeValue,
    value,
    ...props
}: ProgressLineStepProps<TValue>) {
    const buttonId = useId();

    return (
        <li
            {...props}
            aria-current="step"
            className={cn([className, "progress-line-step", active && "active", completed && "completed"])}
        >
            <div className="progress-line-step-dot-divider" />
            <div className="progress-line-step-dot-background">
                <Button
                    id={buttonId}
                    variant="success"
                    aria-label={children}
                    className="progress-line-step-dot"
                    onClick={() => onChangeValue?.(value)}
                />
                <div className="progress-line-step-dot-ping" />
                <label htmlFor={buttonId} className="progress-line-step-span">
                    {children}
                </label>
            </div>
        </li>
    );
}
