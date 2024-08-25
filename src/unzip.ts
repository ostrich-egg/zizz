import { readdir, readFileSync, existsSync, writeFile, statSync, mkdirSync } from "fs";
import { file } from "./file.js";
import { unzip } from "zlib";
import { dirname, resolve, normalize, basename } from "path";
import { promisify } from "util";
import { Buffer } from "buffer";
import { relative, join } from "path";
const readdirAsync = promisify(readdir);

const ifNotExistMakeDir = (path: string): void => {
    if (!existsSync(path)) {
        mkdirSync(path, { recursive: true }
        );
    };
};

const unzipFn = async (f: file): Promise<void> => {
    let rootDir: string = f.getAbsPath();
    const archivedFile = await readdirAsync(rootDir, { recursive: false });
    let bufferPath: string = resolve(rootDir, archivedFile[0] as string);
    const compressedSourceData: Buffer = readFileSync(bufferPath);

    unzip(compressedSourceData, (err, data) => {

        if (err) {
            console.error(new Error(`Error occured while decompressing : , ${err}`));
        };

        const initial_path_of_file: string = (
            data.slice(2)).subarray(0, data.readUInt16BE() + 1
            ).toString().replace(/\0/g, '');

        const basepath: string = resolve(dirname(initial_path_of_file), "..");
        const destRootPath: string = normalize(join(basepath, `${basename(dirname(initial_path_of_file))}(unzipped)`));

        let offset: number = 0;
        //While loop////
        while (offset < data.length) {

            /**PATH : length*/
            const length_of_path: number = data.readUInt16BE(offset);
            if (offset + 2 > data.length) break;
            offset += 2;

            /**PATH : data*/
            const original_path_of_file: string = data.slice(offset, offset + length_of_path).toString().replace(/\0/g, '');
            if (offset + length_of_path > data.length) break;
            offset += length_of_path;

            /**PATH : manipulation */
            let relativePath: string = relative(basepath, original_path_of_file);
            let finalPath: string = join(destRootPath, relativePath);

            /**DATA : length*/
            const length_of_data: number = data.readUInt32BE(offset);
            if (offset + 4 > data.length) break;
            offset += 4;

            /**DATA : data */
            const the_data_of_file: string = data.slice(offset, offset + length_of_data).toString();
            if (offset + length_of_data > data.length) break;
            offset += length_of_data;

            try {
                if (statSync(original_path_of_file).isDirectory()) {
                    ifNotExistMakeDir(finalPath);
                    continue;
                } else {
                    ifNotExistMakeDir(resolve(finalPath, ".."));
                };

                writeFile(finalPath, the_data_of_file.toString(), (err) => {
                    if (err) console.log("Error on writing file", err);
                });
            }
            catch (error) {
                console.log(`Error occured while operating on files ; `, error);
            }
        };
    });
};
export { unzipFn };








