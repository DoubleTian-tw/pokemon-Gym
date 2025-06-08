import { ReactNode } from "react";
import { IoIosInformationCircle, IoMdSettings } from "react-icons/io";
import { PiCardholderBold } from "react-icons/pi";
import { TbPokeball } from "react-icons/tb";
import ThemeMode from "@/components/ThemeMode";

type navType = "link" | "trigger";

interface navProps {
    type: navType;
    path?: string;
    icon: ReactNode;
    content?: ReactNode;
}

const iconClassName = "w-7 h-auto";

export const navList: navProps[] = [
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
                <ThemeMode />
            </li>
        ),
    },
];
