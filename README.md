# LatexEditor

A user-friendly LaTeX editor for Windows written in Agular

## Building

cd into `./projects/latex-editor` and run `ng run latex-editor:desktop`
Note: You may need to run `npm install` in the root of this project, and once you cd into `./projects/latex-editor` for th ebuild to complete

To test changes to the ngx-electronify package, cd to the root of the repository and run `npm run build:ngx-electronify`, next, cd into `./projects/latex-editor` and remove the `"desktop"` builder from the `angular.json` file. Run `ng add build.tar.gz` and you should be good to go. (You will need to re-add the seetings regarding `nodeIntegration`)
