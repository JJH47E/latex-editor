IF NOT EXIST "%1/main.tex" (
	ECHO Unable to find main.tex in given directory, exiting...
	EXIT 2
)

cd "%1"
cd ../../bin/texlive/2021/bin/win32
pdflatex.exe --interaction=nonstopmode -output-directory "%1" "%1/main.tex"

IF NOT EXIST "%1/main.pdf" (
	echo An error occured, unable to find main.pdf
	EXIT 2
) ELSE (
	echo PDF generated successfully, cleaning up other files
	DEL "%1/main.log"
	DEL "%1/main.aux"
)