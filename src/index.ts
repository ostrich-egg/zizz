#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { file } from "./file.js"

const APP_COMMAND = 'zizz';



interface Arguments {
    zip?: string;
    unzip?: string;
    _: (string | number)[];
    $0: string;
    [key: string]: unknown;
};

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
        Missing : Application command did not match. 
        \nDid you mean ${APP_COMMAND}? 
        \n\tExample: ${APP_COMMAND} --zip/unzip "filepath"
        `);
    process.exit(1);
};


let userDefinePath: string = argv.zip || argv.z || argv.u || argv.unzip;

const f = new file(userDefinePath);
const absPath = f.getAbsPath();