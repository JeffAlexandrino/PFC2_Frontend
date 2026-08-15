import { FormControl, InputGroup, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { v4 } from "uuid";

export interface InputSearchProps {
    pesquisa?: string;
    onChange: (value?: string) => void;
    placeholder?: string;
}

export default function InputSearch({ pesquisa, onChange, placeholder }: InputSearchProps) {
    //ESTADOS
    const [value, setValue] = useState<string | undefined>(pesquisa);
    const [inTimeout, setInTimeout] = useState(false);

    //EVENTOS
    useEffect(() => {
        setInTimeout(true);
        const timeOutId = setTimeout(() => {
            onChange(value);
            setInTimeout(false);
        }, 700);
        return () => clearTimeout(timeOutId);
    }, [value, onChange]);

    return (
        <InputGroup data-test="input-search" size="sm">
            <FormControl
                autoComplete="off"
                id={v4()}
                placeholder={placeholder ?? "Pesquisar"}
                aria-label="search"
                aria-describedby="basic-addon1"
                value={value ?? ""}
                onChange={(e) => setValue(e.target.value === "" ? undefined : e.target.value)}
            />
            <InputGroup.Text id="basic-addon1" className="position-relative">
                {inTimeout ? <Spinner size="sm" animation="grow" /> : <i className="bi bi-search" />}
            </InputGroup.Text>
        </InputGroup>
    );
}
