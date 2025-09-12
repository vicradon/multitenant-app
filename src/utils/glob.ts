import { join } from "path";

export function filterEntities(files: string[]): string[] {
    const basePattern = __dirname + '/**/*.entity{.ts,.js}';
    if (files.length === 0) return [basePattern];

    return [
        basePattern,
        ...files.map(f => '!' + join(__dirname, '**', f)),
    ];
}
