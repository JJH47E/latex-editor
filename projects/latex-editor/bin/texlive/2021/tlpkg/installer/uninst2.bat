rmdir /s /q "C:\texlive\2021\bin"
rmdir /s /q "C:\texlive\2021\readme-html.dir"
rmdir /s /q "C:\texlive\2021\readme-txt.dir"
if exist "C:\texlive\2021\temp" rmdir /s /q "C:\texlive\2021\temp"
rmdir /s /q "C:\texlive\2021\texmf-dist"
rmdir /s /q "C:\texlive\2021\tlpkg"
del /q "C:\texlive\2021\README.*"
del /q "C:\texlive\2021\LICENSE.*"
if exist "C:\texlive\2021\doc.html" del /q "C:\texlive\2021\doc.html"
del /q "C:\texlive\2021\index.html"
del /q "C:\texlive\2021\texmf.cnf"
del /q "C:\texlive\2021\texmfcnf.lua"
del /q "C:\texlive\2021\install-tl*.*"
del /q "C:\texlive\2021\tl-tray-menu.exe"
rem del /q "C:\texlive\2021\texlive.profile"
del /q "C:\texlive\2021\release-texlive.txt"
rmdir /s /q "C:/texlive/2021/texmf-var"
rmdir /s /q "C:/texlive/2021/texmf-config"
for %%f in ("C:\texlive\2021\*") do goto :done
for /d %%f in ("C:\texlive\2021\*") do goto :done
rd "C:\texlive\2021"
:done
@echo Done uninstalling TeXLive.
@pause
del "%0"
