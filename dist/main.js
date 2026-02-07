"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// this allows input to be read and for the Scanner class to be accessed in the main file
const readline_1 = __importDefault(require("readline"));
const scanner_js_1 = require("./scanner.js");
// creates readline interface to receive input
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout
});
// creates main function which creates a Scanner with user input and calls Scan()
function main() {
    console.log('Hello! Welcome to my Recursive Directory Scanner!');
    function directoryScan() {
        rl.question('Enter a directory to scan: ', async function (input) {
            try {
                const scanner = new scanner_js_1.Scanner(input);
                await scanner.scan();
                await scanner.displayStats();
            }
            catch {
                console.error('Error scanning directory: ');
            }
            finally {
                console.log();
                console.log("That was fun, wasn't it?!");
                console.log();
                rl.question('Would you like to scan another directory (Yes/No)? ', async function (input) {
                    if (input === 'Yes') {
                        directoryScan();
                    }
                    if (input === 'No') {
                        console.log("Thanks for using my program!");
                        rl.close();
                        return;
                    }
                });
            }
        });
    }
    directoryScan();
}
// calls main()
main();
