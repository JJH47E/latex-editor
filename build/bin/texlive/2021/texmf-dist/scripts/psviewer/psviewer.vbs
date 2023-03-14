' Written by Siep Kroonenberg in 2020 and placed in the Public Domain

option explicit
On Error Resume next

dim oWsh, oFS, sTmp, oArgs, f, fname, tf, i, msg

set oWsh = wscript.createobject( "wscript.Shell" )
Set oFS = CreateObject("Scripting.FileSystemObject")
sTmp=oWsh.ExpandEnvironmentStrings("%Temp%")

Set oArgs = wscript.arguments
If oArgs.count = 0 Then
  msg = "Psviewer is a simple script which converts its argument to a " & _
  " temporary pdf and displays it in the default pdf viewer." _
  & vbcrlf & vbcrlf & _
  "Double-clicking an .eps- or .ps file should result in viewing the " & _
  "converted file. If this does not work, then try right-click and " & _
  "'Open with', which should give you the option to set psviewer as " & _
  "default program for .[e]ps files."
  MsgBox msg, 0, "Psv: no argument"
  wscript.quit
End If
f = oArgs( 0 )
fname = oFS.getfile( f ).Name

Randomize

' find a name for a new temporary pdf file
i = 0
do
  tf = sTmp & "\" & fname & "-" & Int(100000 * Rnd) & ".pdf"
  i = i + 1
  If Not oFS.FileExists( tf ) then
    Exit do
  else
    tf = ""
    if i >= 500 Then
      Exit Do
    End If
  End If
Loop
If tf = "" Then
  wscript.echo "Cannot create temporary pdf"
  wscript.quit
End If

' create temporary pdf
If LCase( Right( fname, 4 )) = ".eps" Then
  If oWsh.run( "kpsewhich -format texmfscripts epstopdf.pl", 0, true ) = 0 Then
    oWsh.run "epstopdf """ & f & """ """ & tf & """", 0, true
  Else
    oWsh.run "gswin32c -q -dNOPAUSE -dBATCH -P- -dSAFER -sDEVICE#pdfwrite -dEPSCrop ""-sOutputFile#" & tf & """ -f """ & f & """", 0, true
  End if
Else
  oWsh.run "gswin32c -q -dNOPAUSE -dBATCH -P- -dSAFER -sDEVICE#pdfwrite ""-sOutputFile#" & tf & """ -f """ & f & """", 0, true
End If

' open temporary pdf
If oFS.fileexists(tf) Then
  oWsh.run( """" & tf & """" )
Else
  MsgBox f & " could not be converted," & vbcrlf & _
  "is probably not valid PostScript", 0, "Error"
End If