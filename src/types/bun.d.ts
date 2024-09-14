declare module "bun" {
    interface BunFile {
        write(content: string | BufferSource | Blob): Promise<number>;
        text(): Promise<string>;
    }

    export function file(path: string): BunFile;
}