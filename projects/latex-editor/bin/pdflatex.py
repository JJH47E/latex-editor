import os
import sys

args = sys.argv
os.system(f'./bin/win32/pdflatex.exe --interaction=nonstopmode {args[2]} {args[1]}');