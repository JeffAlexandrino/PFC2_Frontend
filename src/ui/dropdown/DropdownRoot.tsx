import { createContext, ReactNode, useCallback, useState } from "react";

export const ContextDropdown = createContext({
    menuOpened: false,
    handleOnOpenMenu: () => {},
    handleOnHideMenu: () => {},
});

export interface DropdownRootProps {
    show?: boolean;
    className?: string;
    children?: ReactNode;
    onOpenMenu?: () => void;
    onHideMenu?: () => void;
}

export default function DropdownRoot({ onOpenMenu, onHideMenu, show, ...props }: DropdownRootProps) {
    //ESTADOS
    const [menuOpened, setMenuOpened] = useState(false);

    //EVENTOS
    const handleOnOpenMenu = useCallback(() => {
        if (onOpenMenu) onOpenMenu();
        setMenuOpened(true);
    }, [onOpenMenu]);

    const handleOnHideMenu = useCallback(() => {
        if (onHideMenu) onHideMenu();
        setMenuOpened(false);
    }, [onHideMenu]);

    return (
        <ContextDropdown.Provider value={{ handleOnOpenMenu, handleOnHideMenu, menuOpened: show ?? menuOpened }}>
            <div className={props.className}>{props.children}</div>
        </ContextDropdown.Provider>
    );
}
