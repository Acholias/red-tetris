export type MalusId =
    'fastForward' | // Make 5 soft drop
    'drunk' | // Reserve control for 10 ticks
    'merge'; // Merge current piece with next one

export const allMalus: MalusId[] = [
    'fastForward',
    'drunk',
    'merge',
];
