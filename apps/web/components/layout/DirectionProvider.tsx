"use client";
import { Direction } from "radix-ui";

export default function DirectionProvider({ children }: { children: React.ReactNode }) {
	return (
		<Direction.Provider dir="rtl">{children}</Direction.Provider>
	);
}