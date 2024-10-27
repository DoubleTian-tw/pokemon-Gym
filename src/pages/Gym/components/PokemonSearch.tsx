"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { debounce } from "lodash-es";
// Sample data for search results
const items = [
    "Apple",
    "Banana",
    "Cherry",
    "Date",
    "Elderberry",
    "Fig",
    "Grape",
    "Honeydew",
    "Kiwi",
    "Lemon",
];

const PokemonSearch = () => {
    const [searchInput, setSearchInput] = useState("");
    const [filteredItems, setFilteredItems] = useState<string[]>([]);
    const [isSelecting, setIsSelecting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLDivElement>(null);

    const debounceSearchInput = useCallback(
        debounce((input: string) => {
            const filtered = items.filter((item) =>
                item.toLowerCase().includes(input.toLowerCase())
            );
            setFilteredItems(filtered);
            setIsOpen(input.length > 0 && filtered.length > 0);
        }, 500),
        []
    );

    useEffect(() => {
        if (isSelecting === false) {
            debounceSearchInput(searchInput);
        } else {
            setIsSelecting(false);
        }
    }, [searchInput, debounceSearchInput, isSelecting]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
        if (searchInput && filteredItems.length > 0) setIsOpen(true);
    };

    const handleItemClick = (item: string) => {
        setSearchInput(item);
        setIsOpen(false);
        setIsSelecting(true);
    };

    return (
        <div className="relative w-full mb-6">
            <div className="relative">
                <Input
                    ref={inputRef as React.RefObject<HTMLInputElement>}
                    type="text"
                    placeholder="Search..."
                    value={searchInput}
                    onChange={handleInputChange}
                    onClick={handleInputClick}
                    className="pl-10 w-full"
                    aria-label="Search"
                    aria-autocomplete="list"
                    aria-controls="search-dropdown"
                    aria-expanded={isOpen}
                />
                <Button
                    size="icon"
                    variant="ghost"
                    className="absolute left-0 top-0 h-full"
                    aria-label="Search">
                    <Search className="h-4 w-4" />
                </Button>
            </div>
            {isOpen && (
                <div
                    ref={dropdownRef}
                    id="search-dropdown"
                    className="absolute z-10 w-full mt-1 bg-primary-foreground rounded-md shadow-lg max-h-60 overflow-auto"
                    role="listbox">
                    {filteredItems.map((item, index) => (
                        <div
                            key={index}
                            className="px-4 py-2 hover:bg-background cursor-pointer"
                            onClick={() => handleItemClick(item)}
                            role="option">
                            {item}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PokemonSearch;
