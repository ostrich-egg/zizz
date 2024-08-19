import { file } from "./file.js";
import { resolve } from "path";
import fs, { createWriteStream, readFileSync } from "fs";
import { Buffer } from "buffer";
import { createGzip } from "zlib";
import { pipeline, Readable } from "stream";
import { promisify } from "util";
const pipeLineAsync = promisify(pipeline);

const zip = async (f: file) => {

    f.getAbsPath();
    const allFilesPath: _allFilesPath[] = f.getAllFilesPath();

    const archivedFile: string = f.zip_createInitialFolderSt(
        resolve(allFilesPath[0].parentPath, "..")
    );

    for (const { name, parentPath } of allFilesPath) {

        const absfilePath: string = resolve(parentPath, name);
        if (fs.statSync(absfilePath).isDirectory()) continue;

        const file_path_buffer: Buffer = Buffer.from(absfilePath);
        let l_file_path_buffer: Buffer = Buffer.alloc(2);
        l_file_path_buffer.writeUInt16BE(file_path_buffer.length);

        const file_data_buffer: Buffer = Buffer.from(readFileSync(absfilePath));
        let l_file_data_buffer: Buffer = Buffer.alloc(4);
        l_file_data_buffer.writeUInt32BE(file_data_buffer.length);

        const joinBuffer: Buffer = Buffer.concat([l_file_path_buffer, file_path_buffer, l_file_data_buffer, file_data_buffer]);
        const bufferStreams: Readable = Readable.from(joinBuffer);
        const writeStream: fs.WriteStream = createWriteStream(archivedFile);

        try {
            await pipeLineAsync(bufferStreams, createGzip(), writeStream);
        } catch (error) {
            console.log(error);
        };
    };
};
export { zip }