# simple-thesis-dissertation

Template for a simple thesis or dissertation (Ph.D. or master's degree) or technical report, in XeLaTeX.

**Website:**

https://github.com/zachscrivena/simple-thesis-dissertation

**Lead author:**

Zach Scrivena (zachscrivena@gmail.com)

**Compiled sample document:**

Thesis.pdf

## Main Features

- Simple template that can be further customized or extended.
- Template document contains numerous examples.
- Consistent style for figures, tables, mathematical theorems, definitions, lemmas, etc.
- Direct support for TrueType (TTF) and OpenType (OTF) fonts.
- Direct support for multilingual Unicode characters, with the appropriate fonts.
- Hyperlinks can be included in generated PDF.

## Overview

The main XeLaTeX source file is `Thesis.tex`; the compiled document is `Thesis.pdf`.

Instructions for compiling the document (TeX &rarr;(XeLaTeX)&rarr; PDF):

- **Method 1:** Use `latexmk` for fully automated document generation:
	- `latexmk -xelatex "Thesis.tex"`
	(add the `-pvc` switch to automatically recompile on changes)

- **Method 2:** Use `xelatex` directly:
	- `xelatex "Thesis.tex"`
	(run multiple times to resolve cross-references if needed)

## License

This is free and unencumbered software released into the public domain.
For more information, please see the file `LICENSE` or refer to <http://unlicense.org>.
