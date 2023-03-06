rem @echo off
setlocal
path C:\texlive\2021\tlpkg\tlperl\bin;C:\texlive\2021\bin\win32;%path%
set PERL5LIB=C:\texlive\2021\tlpkg\tlperl\lib
rem Clean environment from other Perl variables
set PERL5OPT=
set PERLIO=
set PERLIO_DEBUG=
set PERLLIB=
set PERL5DB=
set PERL5DB_THREADED=
set PERL5SHELL=
set PERL_ALLOW_NON_IFS_LSP=
set PERL_DEBUG_MSTATS=
set PERL_DESTRUCT_LEVEL=
set PERL_DL_NONLAZY=
set PERL_ENCODING=
set PERL_HASH_SEED=
set PERL_HASH_SEED_DEBUG=
set PERL_ROOT=
set PERL_SIGNALS=
set PERL_UNICODE=

perl.exe "C:\texlive\2021\texmf-dist\scripts\texlive\uninstall-win32.pl" %1

if errorlevel 1 goto :eof
rem test for taskkill and try to stop exit tray menu
taskkill /? >nul 2>&1
if not errorlevel 1 1>nul 2>&1 taskkill /IM tl-tray-menu.exe /f
copy "C:\texlive\2021\tlpkg\installer\uninst2.bat" "%TEMP%"
rem pause
"%TEMP%\uninst2.bat"
