import { readdir, readFileSync, existsSync, mkdir, writeFile, fstat, statSync, mkdirSync } from "fs";
import { file } from "./file.js";
import { unzip } from "zlib";
import { dirname, resolve, normalize } from "path";
import { promisify } from "util";
import { Buffer } from "buffer";
import { relative, join } from "path";
const readdirAsync = promisify(readdir);

const unzipFn = async (f: file) => {
    let rootDir: string = f.getAbsPath();
    const archivedFile = await readdirAsync(rootDir, { recursive: false });
    let bufferPath: string = resolve(rootDir, archivedFile[0] as string);
    const compressedSourceData: Buffer = readFileSync(bufferPath);


    unzip(compressedSourceData, (err, data) => {

        if (err) {
            console.error(new Error(`Error occured, ${err}`));
        };

        const initial_path_of_file: string = (
            data.slice(2)).subarray(0, data.readUInt16BE() + 1
            ).toString();

        console.log('initial_path_of_file :   ', initial_path_of_file);
        const basepath: string = resolve(dirname(initial_path_of_file), "..");
        const destRootPath: string = normalize(join(basepath, "donhomah"));
        console.log("base path", basepath);

        while (data.length > 0) {

            /**PATH : length*/
            const length_of_path: number = data.readUInt16BE();
            if (data.length < 2) break;
            data = data.slice(2);

            /**PATH : data*/
            const original_path_of_file: string = data.subarray(0, length_of_path + 1).toString('utf-8').replace(/\0/g, '');
            if (data.length < length_of_path) break;
            data = data.slice(length_of_path);

            let relativePath: string = relative(basepath, original_path_of_file);
            let finalPath: string = join(destRootPath, relativePath);
            console.log("Final Path", finalPath);


            /**DATA : length*/
            const length_of_data: number = data.readUInt32BE();
            if (data.length < 4) break;
            data = data.slice(4);


            /**DATA : data */
            const the_data_of_file: string = data.subarray(0, length_of_data).toString('utf-8');
            if (data.length < length_of_data) break;
            data = data.slice(length_of_data);


            if (statSync(original_path_of_file).isDirectory()) {
                if (!existsSync(finalPath)) {
                    mkdir(resolve(finalPath), { recursive: true }, (err, path) => {
                        console.log("Error while making the directory", err);
                        if (path) console.log(`Directory made :- ${path}`);
                    })
                };
                continue;

            } else {
                if (!existsSync(finalPath)) {
                    mkdir(dirname(finalPath), { recursive: true }, (err, path) => {
                        console.log("Error while making the directory", err);
                        if (path) console.log(`Directory made  :- ${path}`)
                    })
                };
            };

            writeFile(finalPath, the_data_of_file.toString(), (err) => {
                if (err) console.log("Error on writing file", err)
            })
        };
    });
};

export { unzipFn };






