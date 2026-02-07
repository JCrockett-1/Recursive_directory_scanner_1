// here I import a number of things. Readdir lets me read files in a directory, stat helps tell me if it's a file or a folder, and join makes it easy to add to the path
import { readdir } from 'fs/promises';
import { stat } from 'fs/promises';
import { join } from 'path';

// creates scanner class with rootDir which will take the user inputted directory, and the function scan within
export class Scanner {

    rootDir: string;

    constructor(rootDir: string) {
        this.rootDir = rootDir;
    }

// this gives statistic on the amount of files that were accessed, folders, and when access was denied
    private fileCount: number = 0;
    private folderCount: number = 0;
    private noPermissionCount: number = 0;

// this scan function will search through all the files and directories in a given directory and display the contents while showing the file structure 
    public async scan(space: string = ''): Promise<{files: number, folders: number, denied: number}> {

// this try catches directories where no permission is given for VSCode to open
            try {
                const files = await readdir(this.rootDir);

// this evaluates everything in the first level of the directory, if it's a file the path is added (dead end), if it's a folder it dives deeper with subScanner which recursively calls Scan ();
                for (let i = 0; i < files.length; i++) {
                    const fullPath = join(this.rootDir, files[i]);

// this try catches files where no permission is given for VSCode to access
                    try {
                        const characteristic = await stat(fullPath);
                    
                        if(characteristic.isDirectory()) {
                            this.folderCount++;
                            console.log(space + files[i] + ' /');
                            const subScanner = new Scanner(fullPath);
                            const carriedCounts = await subScanner.scan(space + '  ')
                            this.fileCount += carriedCounts.files;
                            this.folderCount += carriedCounts.folders;
                            this.noPermissionCount += carriedCounts.denied;
                        }
                        else {
                            this.fileCount++;
                            console.log(space + files[i])
                        }
                    }
                    catch {
                        // console.error("Don't have permission to open file")
                        this.noPermissionCount++;
                    }
                }
            }
            catch {
                // console.error("Cannot read directory")
                this.noPermissionCount++;
            }
        return {files: this.fileCount, folders: this.folderCount, denied: this.noPermissionCount};
    }     
    
    public displayStats(): void {
        console.log('This is a summary of the statistic in the directory given');
        console.log(`Files: ${this.fileCount}`)
        console.log(`Folders: ${this.folderCount}`)
        console.log(`Access Denied: ${this.noPermissionCount}`)
    }
}