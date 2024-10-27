import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Toggle } from "@/components/ui/toggle";
import { nanoid } from "nanoid";
import React, { FunctionComponent } from "react";

interface abilityProps {
    enName: string;
    zhName: string;
    bgColor: string;
}
interface AvatarProps {
    name: string;
    src: string;
    abilities: abilityProps[];
}

const PokemonAvatar: FunctionComponent<AvatarProps> = ({
    name,
    src,
    abilities,
}) => {
    return (
        <div className="flex">
            <div className="flex flex-col justify-center gap-2">
                {abilities.map((item) => (
                    <Button
                        key={nanoid()}
                        className="px-2 py-1 h-auto rounded-full
                        ">
                        {item.zhName}
                    </Button>
                ))}
            </div>
            <HoverCard>
                <HoverCardTrigger>
                    <Toggle
                        aria-label="Toggle italic"
                        className="h-16 w-16 rounded-full">
                        <Avatar className="h-14 w-14">
                            <AvatarImage src={src} alt={name} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </Toggle>
                </HoverCardTrigger>
                <HoverCardContent className="w-auto">{name}</HoverCardContent>
            </HoverCard>
        </div>
    );
};

export default PokemonAvatar;
