"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { nanoid } from "nanoid";
import { TbPokeball } from "react-icons/tb";
import { PiCardholderBold } from "react-icons/pi";
import { IoIosInformationCircle, IoMdSettings } from "react-icons/io";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ModeToggle";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navbar-menu";

type navType = "link" | "trigger";

interface navProps {
    type: navType;
    path?: string;
    icon: ReactNode;
    content?: ReactNode;
}

const iconClassName = "w-7 h-auto";
const navList: navProps[] = [
    {
        type: "link",
        path: "/",
        icon: <TbPokeball className={iconClassName} />,
    },
    {
        type: "link",
        path: "/About",
        icon: <IoIosInformationCircle className={iconClassName} />,
    },
    {
        type: "link",
        path: "/Pokedex",
        icon: <PiCardholderBold className={iconClassName} />,
    },
    {
        type: "trigger",
        icon: <IoMdSettings className={iconClassName} />,
        content: (
            <li>
                <ModeToggle />
            </li>
        ),
    },
];

const NavLink = ({ path, children }) => {
    const location = useLocation();
    const isActive = path === location.pathname;
    return (
        <NavigationMenuItem className="flex-1">
            <Link to={path}>
                <NavigationMenuLink
                    asChild
                    className={cn(
                        navigationMenuTriggerStyle({
                            type: "icon",
                        }),
                        isActive &&
                            "bg-gradient-to-b from-accent to-linear text-navbar-active"
                    )}>
                    <div>{children}</div>
                </NavigationMenuLink>
            </Link>
        </NavigationMenuItem>
    );
};
const NavTrigger = ({ navWidth, content, children }) => {
    return (
        <NavigationMenuItem>
            <NavigationMenuTrigger displayType="icon">
                <div>{children}</div>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
                <ul
                    className="grid grid-cols-1 gap-4 p-4 md:w-[400px] lg:w-[500px] "
                    style={{ width: `${navWidth}px` }}>
                    {content}
                </ul>
            </NavigationMenuContent>
        </NavigationMenuItem>
    );
};

const TabBar = () => {
    const navRef = useRef<HTMLDivElement>(null);
    const [navWidth, setNavWidth] = useState(0);
    useEffect(() => {
        setNavWidth(navRef.current?.offsetWidth);
    }, [navRef.current]);

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
                                    <NavLink key={nanoid()} path={nav.path}>
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
export default TabBar;
