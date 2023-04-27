# LatexEditor

A user-friendly LaTeX editor for Windows written in Agular

## Building

cd into `./projects/latex-editor` and run `ng run latex-editor:desktop`

To test changes to the ngx-electronify package, cd to the root of the repository and run `npm run build:ngx-electronify`, next, cd into `./projects/latex-editor` and remove the `"desktop"` builder from the `angular.json` file. Run `ng add build.tar.gz` and you should be good to go.
