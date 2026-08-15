import { Link, LinkProps } from "react-router-dom";

import "./styles.css";

export default function MyLink(props: LinkProps) {
    return (
        <Link className="my-link text-info" {...props}>
            {props.children}
        </Link>
    );
}
