Set WshShell = CreateObject("WScript.Shell")
strDesktop = WshShell.SpecialFolders("Desktop")
set oShellLink = WshShell.CreateShortcut(strDesktop & "\Ronie va Nhi Mami Toan Lop 1.lnk")
oShellLink.TargetPath = "C:\Users\Admin\.gemini\antigravity\scratch\ronie-nhi-mami-math\CHAY_GAME.bat"
oShellLink.WorkingDirectory = "C:\Users\Admin\.gemini\antigravity\scratch\ronie-nhi-mami-math"
oShellLink.WindowStyle = 1
oShellLink.Description = "Ronie va Nhi Mami - Vuong Quoc Toan Hoc"
oShellLink.Save
WScript.Echo "DA TAO THANH CONG PHIM TAT TREN DESKTOP!"
