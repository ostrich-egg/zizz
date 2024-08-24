import { file } from "./file.js";
import { resolve } from "path";
import fs, { createWriteStream, readFileSync } from "fs";
import { Buffer } from "buffer";
import { createGzip } from "zlib";

const zip = async (f: file) => {

    f.getAbsPath();
    const allFilesPath: _allFilesPath[] = f.getAllFilesPath();
    const archivedFile: string = f.zip_createInitialFolderSt(
        resolve(allFilesPath[0].parentPath, "..")
    );
    const writeStream: fs.WriteStream = createWriteStream(archivedFile);
    const gzipStream = createGzip();
    gzipStream.pipe(writeStream);//pipe all the data from gzipStream to output stream as it is in writeStream

    try {
        for (const { name, parentPath } of allFilesPath) {

            const absfilePath: string = resolve(parentPath, name);
            if (fs.statSync(absfilePath).isDirectory()) continue;

            const filePath_buffer: Buffer = Buffer.from(absfilePath);
            let l_filePath_buffer: Buffer = Buffer.alloc(2);
            l_filePath_buffer.writeUInt16BE(filePath_buffer.length);

            const fileData_buffer: Buffer = Buffer.from(readFileSync(absfilePath));
            let l_fileData_buffer: Buffer = Buffer.alloc(4);
            l_fileData_buffer.writeUInt32BE(fileData_buffer.length);

            const joinBuffer: Buffer = Buffer.concat([l_filePath_buffer, filePath_buffer, l_fileData_buffer, fileData_buffer]);
            gzipStream.write(joinBuffer);
        };
    } catch (error) {
        console.log(new Error(`Error occured while zipping.:: ${error}`));
    }
    finally {
        gzipStream.end();
        await new Promise((resolve, reject) => {
            writeStream.on('finish', resolve)
            writeStream.on('error', reject)
        });
        writeStream.end();
    }
};



export { zip }