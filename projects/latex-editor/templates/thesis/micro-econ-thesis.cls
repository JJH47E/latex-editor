% =============================================================================
% micro-econ-thesis.cls
% Documentclass for theses at the chair of Microeconomics at the FSU Jena,
% based on diplarb.sty by Christoph Gollmick (05.09.2002) 
%
% Author:             Holger Graf (2016-09-28)
% this version:  			Holger Graf (2020-10-27)
% =============================================================================
\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{micro-econ-thesis}[2016/09/08 v1.1 micro-econ-thesis]
\typeout{Document class for theses at the chair of Microeconomics at the FSU Jena}
\LoadClass[12pt,a4paper]{article}
\usepackage{ifthen}
\usepackage{tabularx}
\usepackage{hyperref}
\usepackage[svgnames]{xcolor}

% ----------------------------------------------------------------------------
% Seitenraender, Abstaende, Zaehler
% ----------------------------------------------------------------------------
\setlength{\topmargin}{0.0cm}
\setlength{\textheight}{23.0cm}
\setlength{\textwidth}{15.0cm}
\setlength{\headsep}{0.8cm}
\setlength{\oddsidemargin}{0.9cm}
\addtolength{\evensidemargin}{-2.49cm}
\setlength{\parindent}{0pt}
\setlength{\parskip}{5pt plus 2pt minus 1pt}
\setcounter{secnumdepth}{3}
\setcounter{tocdepth}{3}
% Damit mehr Tabellen/Abbildungen auf eine Seite passen. (Kopka-Buch S. 170)
\setcounter{topnumber}{9}
\setcounter{totalnumber}{9}
% grosse Objekte nicht erst auf letzter Seite... (siehe Kopka-Buch S. 170)
\renewcommand{\topfraction}{0.99}
\renewcommand{\textfraction}{0.01}
% typische Abkuerzungen
\newcommand{\zB}{z.\,B.\ }
\newcommand{\idR}{i.\,d.\,R.\ }
\newcommand{\bzw}{bzw.\ }
\newcommand{\etc}{etc.\ }
\newcommand{\iA}{i.\,A.\ }
\newcommand{\uU}{u.\,U.\ }
\newcommand{\ua}{u.\,a.\ }
\newcommand{\usw}{usw.\ }
\renewcommand{\dh}{d.\,h.\ }
% Hurenkinder und Schusterjungen verbieten
\clubpenalty = 10000
\widowpenalty = 10000
\displaywidowpenalty = 10000

% ----------------------------------------------------------------------------
% Schnittstellen-Parameter
% ----------------------------------------------------------------------------
% interne Makros initialisieren/vorbelegen
\newcommand{\@thesisTitle}{}
\newcommand{\@thesisType}{}
\newcommand{\@thesisAuthor}{}
\newcommand{\@thesisMail}{}
\newcommand{\@thesisGrade}{}
\newcommand{\@thesisTutora}{}
\newcommand{\@thesisTutorb}{}
\newcommand{\@thesisDate}{}
\newcommand{\@thesisCompany}{}
\newcommand{\@thesisMatrikel}{}
\newcommand{\@thesisAddress}{}

% aktuelle Daten uebernehmen
\newcommand{\thesisTitle}[1]{\renewcommand{\@thesisTitle}{#1}}
\newcommand{\thesisType}[1]{\renewcommand{\@thesisType}{#1}}
\newcommand{\thesisAuthor}[1]{\renewcommand{\@thesisAuthor}{#1}}
\newcommand{\thesisMail}[1]{\renewcommand{\@thesisMail}{#1}}
\newcommand{\thesisGrade}[1]{\renewcommand{\@thesisGrade}{#1}}
\newcommand{\thesisTutora}[1]{\renewcommand{\@thesisTutora}{#1}}
\newcommand{\thesisTutorb}[1]{\renewcommand{\@thesisTutorb}{#1}}
\newcommand{\thesisDate}[1]{\renewcommand{\@thesisDate}{#1}}
\newcommand{\thesisCompany}[1]{\renewcommand{\@thesisCompany}{#1}}
\newcommand{\thesisMatrikel}[1]{\renewcommand{\@thesisMatrikel}{#1}}
\newcommand{\thesisAddress}[1]{\renewcommand{\@thesisAddress}{#1}}

% ----------------------------------------------------------------------------
% Initialisierung des hyperref-Pakets
% ----------------------------------------------------------------------------
\hypersetup{
  plainpages = {false}, % Seitenanker-Formatierung
  colorlinks = {true}, % Links farbig machen, sonst umrandet
  linkcolor = {DarkBlue}, % normale Links (Inhalt, Abb.)
  citecolor = {DarkBlue}, % Literaturverweise
  urlcolor = {DarkBlue}, % URL-Links
  bookmarksnumbered = {true}, % Nummerierung der Kapitel
  bookmarksopen = {false}, % alle aufgebl"attert
  breaklinks = {true}
}

% ----------------------------------------------------------------------------
% Erzeugung des Deckblatts
% ----------------------------------------------------------------------------
\newcommand{\thesisMakeTitle}[0]{
  \cleardoublepage
  \pagenumbering{alph}
  \pagestyle{empty}
  \null
  \begin{center}
    \Large
      {\huge\textbf{\@thesisTitle}\par}
    \vfill
      \textbf{-- \@thesisType{} --}
    \vfill
      \ifthenelse{\equal{\@thesisGrade}{}}{}{to be awarded}
    \vskip 1ex
      \@thesisGrade
    \vfill
      {\large submitted by} \\[1ex]
      \@thesisAuthor \\[2em]
    \vfill
      {\large \@thesisDate \\[2em]}

		\begin{minipage}[t]{\textwidth} 
    {\normalsize
			\@thesisAuthor \\
			\texttt{\@thesisMail}\\
			Student ID: \@thesisMatrikel \\
      Address:\\
			\@thesisAddress
			\par
    }
		\end{minipage}
			
    \vfill
		\begin{minipage}[t]{\textwidth} 
    {\normalsize
      Supervisor \\[1ex]        
      \ifthenelse{\equal{\@thesisTutora}{}}{}{1st: \@thesisTutora \\}
      \ifthenelse{\equal{\@thesisTutorb}{}}{}{2nd: \@thesisTutorb \\}
      
			\smallskip
      Friedrich-Schiller-Universit{\"a}t Jena \\
      Fakult{\"a}t f{\"u}r Wirtschaftswissenschaften \\
      Lehrstuhl f{\"u}r Mikro{\"o}konomik \\
      Carl-Zei{\ss}-Str. 3 \\
      07743 Jena \\[2ex]
      \@thesisCompany
      \par
    }
		\end{minipage}
  \end{center}
  % Setup des hyperref-Pakets vervollst"andigen (Autor, Titel)
  \hypersetup{
    pdfauthor = {\@thesisAuthor}, % Author
    pdftitle = {\@thesisTitle}, % Titel
  }
}

% ----------------------------------------------------------------------------
% Erzeugung der Selbststaendigkeits-Erklaerung
% ----------------------------------------------------------------------------
\newcommand{\makeThesisDeclaration}{
  \cleardoublepage
  \thispagestyle{empty}
  ~\vfill
  \subsection*{Statutory Declaration:}
  I declare that I have developed and written the enclosed Master Thesis completely by myself,
and have not used sources or means without declaration in the text. Any thoughts from others
or literal quotations are clearly marked. The Master Thesis was not used in the same or in a
similar version to achieve an academic grading or is being published elsewhere. \\[2ex]

\begin{tabularx}{\textwidth}{@{}p{4cm}Xp{4cm}@{}}
	& &   \\ 
\cline{1-1}\cline{3-3}
Place, Date  & & Signature  \\
\end{tabularx}
} 