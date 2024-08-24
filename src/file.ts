import { normalize, resolve, basename } from "path";
import fs, { existsSync, mkdirSync } from "fs";


const ARCHIVED_FILE = "archived.archive";

class file {

    private absPath: string = '';
    private allFilesPath: _allFilesPath[] = [];

    constructor(private path: string) {
        if (!this.path) {
            this.path = ".";
            console.warn("WARNING : Path is missing so 'current working directory' is taken for process");
        }
    };

    public getAbsPath(): string {
        this.absPath = normalize(resolve(process.cwd(), this.path));
        return this.absPath;
    };

    public getAllFilesPath(): _allFilesPath[] {

        if (!existsSync(this.absPath)) {
            console.warn("File path doesn't exists. Process terminated!");
            process.exit(1);

        };
        fs.readdir(this.absPath,
            {
                withFileTypes: true,
                recursive: true
            },
            (err, files) => {

                if (err) {
                    console.log(new Error(`Error occured on reading directory Info : ${err}`));
                    return;
                };
                files.forEach(each => this.allFilesPath.push({ name: each.name, parentPath: each.path }));
            }
        );

        return this.allFilesPath;
    };

    public zip_createInitialFolderSt(root: string): string {
        /////////////////////////////////////////////////////
        //TODO : MAKE USER BE ABLE TO GIVE THE NAME OF THE ZIPPED FOLDER
        /////////////////////////////////////////////////////
        const folderRoot: string = resolve(root, `${basename(this.absPath)}_zipped`);
        if (!existsSync(folderRoot)) mkdirSync(folderRoot, { recursive: true });
        fs.writeFile(resolve(folderRoot as string, ARCHIVED_FILE), "", (err) => {
            if (err) console.error(new Error(`Something went wrong while creating file. More Info : ${err}`));
        });
        return resolve(folderRoot as string, ARCHIVED_FILE);
    };
};

export { file }