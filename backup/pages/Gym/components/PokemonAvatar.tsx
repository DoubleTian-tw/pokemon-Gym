import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Toggle } from "@/components/ui/toggle";
import {
    AbilityType,
    ABILITIES,
    ERROR_ABILITY,
} from "@/constants/pokemon/ability";
import { cn } from "@/lib/utils";
import { nanoid } from "nanoid";
import React, { FunctionComponent } from "react";

interface AvatarProps {
    name: string;
    src: string;
    abilities: AbilityType[];
}

const CURRENT_LANG = "zh-Hant";
const PokemonAvatar: FunctionComponent<AvatarProps> = ({
    name,
    src,
    abilities,
}) => {
    const isZhHant = CURRENT_LANG === "zh-Hant";
    const processAbilities = abilities.map(
        (ability) => ABILITIES[ability as AbilityType] || ERROR_ABILITY
    );

    return (
        <div className="flex">
            <div className="flex flex-col justify-center gap-2">
                {processAbilities.map((ability) => {
                    return (
                        <Button
                            key={nanoid()}
                            className={cn(
                                "px-2 py-1 h-auto rounded-full text-white"
                            )}
                            style={{ backgroundColor: ability.bgColor }}>
                            {isZhHant ? ability.zhName : ability.enName}
                        </Button>
                    );
                })}
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
