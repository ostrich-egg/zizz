import fs, { mkdir, mkdirSync } from "fs";
import path, { basename, relative, dirname, resolve, normalize, join } from 'path';
import { homedir } from "os";
import { dir } from "console";

let base = '/home/sauhardha-kafle/Desktop/zips';
let source = '/home/sauhardha-kafle/Desktop/zips/build/files.js';
let destrootPath = '/home/sauhardha-kafle/Desktop/zips/build_ithere';

console.log(resolve(dirname(source), ".."))


let rel = relative(base, source);
console.log(rel);

let joi = join(destrootPath, rel);
console.log(joi);


// let before = resolve(x, "..")
// let dir = `${basename(x)}_ithere`
// console.log(dir)
// console.log(before)

// let j = path.resolve(before, dir)
// console.log(j)

// let k = relative(w, j);
// console.log(k)
// console.log(join(w, k))
