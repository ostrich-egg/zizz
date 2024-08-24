#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { zip } from "./zip.js";
import { file } from "./file.js";
import { unzipFn } from "./unzip.js";


const APP_COMMAND = 'zizz';

const argv: any = yargs(hideBin(process.argv))
    .command(APP_COMMAND, 'File compressor and decompressor', {

        zip: {
            description: "zip commands serves the purpose of compressing the file",
            alias: "z",
            type: "string",
            demandOption: false,
        },

        unzip: {
            description: "unzip commands serves the purpose of decompressing the file",
            alias: "u",
            type: "string",
            demandOption: false
        }

    })
    .help()
    .alias("help", "h")
    .argv as Arguments



console.log(argv)

if (argv._[0] != APP_COMMAND) {
    console.error(`
        Missing : Application command did not match. Did you mean ${APP_COMMAND}? 
        \n\tExample: ${APP_COMMAND} --zip/unzip "filepath".
        \nProcess Terminated!
        `);
    process.exit(1);
};


let userDefinedPath: string = argv.zip || argv.z || argv.u || argv.unzip;

const f: file = new file(userDefinedPath);

if (argv.hasOwnProperty('zip')) {
    zip(f);
};

if (argv.hasOwnProperty('unzip')) {
    unzipFn(f);
}




