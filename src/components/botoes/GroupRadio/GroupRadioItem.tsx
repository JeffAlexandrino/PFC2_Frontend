import { ReactNode } from "react";
import { v4 } from "uuid";

import "./styles.css";

export interface GroupRadioItemProps {
    className?: string;
    children?: ReactNode;
    name?: string;
    checked?: boolean;
    onActive: () => void;
}

export default function GroupRadioItem(props: GroupRadioItemProps) {
    //VARIABLES
    const id = v4();
    const classNameIfChecked = props.checked ? "bg-opacity-100" : "";

    return (
        <>
            <input
                onChange={(e) => (e.target.checked ? props.onActive() : undefined)}
                checked={props.checked}
                type="radio"
                className="btn-check"
                name={props.name}
                id={id}
                autoComplete="off"
            />
            <label
                className={`${props.className} ${classNameIfChecked} bg-dark bg-opacity-50 text-white btn my-group-radio-item border-0`}
                htmlFor={id}
            >
                {props.children}
            </label>
        </>
    );
}
