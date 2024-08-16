import path, { normalize, resolve } from "path";
import fs from "fs";


class file {

    constructor(private path: string) {
        if (!this.path) {
            this.path = ".";
            console.error("Path is missing so 'current working directory' is taken for process");
        }
    };

    public getAbsPath(): string {
        return normalize(resolve(process.cwd(), this.path));
    };
}

export { file }