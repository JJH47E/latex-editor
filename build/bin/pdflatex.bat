IF NOT EXIST "%1/main.tex" (
	ECHO Unable to find main.tex in given directory, exiting...
	EXIT 2
)

cd "%1"
cd ../../bin/texlive/2021/bin/win32
pdflatex.exe --interaction=nonstopmode -halt-on-error -output-directory "%1" "%1/main.tex"
cd "%1"

IF NOT EXIST "./main.pdf" (
	echo An error occured, unable to find main.pdf
	EXIT 2
) ELSE (
	echo PDF generated successfully, cleaning up other files
	DEL "./main.log"
	DEL "./main.aux"
)