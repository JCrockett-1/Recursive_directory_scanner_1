// here I import a number of things. Readdir lets me read files in a directory, stat helps tell me if it's a file or a folder, join makes it easy to add to the path, and basename will help me display the final file in a path to display in a tree like fashion
import { readdir } from 'fs/promises';
import { stat } from 'fs/promises';
import { join } from 'path';
// creates scanner class with rootDir which will take the user inputted directory, and the function scan within
export class Scanner {
    rootDir;
    constructor(rootDir) {
        this.rootDir = rootDir;
    }
    // this gives statistic on the amount of files that were accessed, folders, and when access was denied
    fileCount = 0;
    folderCount = 0;
    noPermissionCount = 0;
    // this scan function will search through all the files and directories in a given directory and display the contents while showing the file structure 
    async scan(space = '') {
        // this try catches directories where no permission is given for VSCode to open
        try {
            const files = await readdir(this.rootDir);
            // this evaluates everything in the first level of the directory, if it's a file the path is added (dead end), if it's a folder it dives deeper with subScanner which recursively calls Scan ();
            for (let i = 0; i < files.length; i++) {
                const fullPath = join(this.rootDir, files[i]);
                // this try catches files where no permission is given for VSCode to access
                try {
                    const characteristic = await stat(fullPath);
                    if (characteristic.isDirectory()) {
                        this.folderCount++;
                        console.log(space + files[i] + ' /');
                        const subScanner = new Scanner(fullPath);
                        const carriedCounts = await subScanner.scan(space + '  ');
                        this.fileCount += carriedCounts.files;
                        this.folderCount += carriedCounts.folders;
                        this.noPermissionCount += carriedCounts.denied;
                    }
                    else {
                        this.fileCount++;
                        console.log(space + files[i]);
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
        return { files: this.fileCount, folders: this.folderCount, denied: this.noPermissionCount };
    }
    displayStats() {
        console.log('This is a summary of the statistic in the directory given');
        console.log(`Files: ${this.fileCount}`);
        console.log(`Folders: ${this.folderCount}`);
        console.log(`Access Denied: ${this.noPermissionCount}`);
    }
}
