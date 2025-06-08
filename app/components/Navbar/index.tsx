import {
    NavigationMenu,
    NavigationMenuList,
} from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";
import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import { navList } from "@/constants/navbar";
import NavLink from "./NavLink";
import NavTrigger from "./NavTrigger";

const Navbar = () => {
    const navRef = useRef<HTMLDivElement>(null);
    const [navWidth, setNavWidth] = useState(0);
    useEffect(() => {
        setNavWidth(navRef.current?.offsetWidth || 0);
    }, [navRef]);

    return (
        <div
            className={cn(
                "fixed bottom-0 w-full flex justify-center bg-navbar"
            )}>
            <NavigationMenu ref={navRef}>
                <NavigationMenuList>
                    {navList.map((nav) => {
                        switch (nav.type) {
                            case "link":
                                return (
                                    <NavLink
                                        key={nanoid()}
                                        path={nav.path || ""}>
                                        {nav.icon}
                                    </NavLink>
                                );
                            case "trigger":
                                return (
                                    <NavTrigger
                                        key={nanoid()}
                                        navWidth={navWidth}
                                        content={nav.content}>
                                        {nav.icon}
                                    </NavTrigger>
                                );
                        }
                    })}
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    );
};
export default Navbar;
