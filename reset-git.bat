@echo off
cd "c:\Users\Dipesh Mishra\barbershopproject"
rmdir /s /q .git 2>nul
git init
git add .gitignore
git add admin.html
git add app.js
git add auth.js
git add config.example.js
git add FIREBASE_RULES.md
git add firebase.js
git add index.html
git add README.md
git add style.css
git add TODO.md
git commit -m "Production ready - credentials protected"
git remote add origin https://github.com/Dipesh-Mishra04/FadeBar.git
git push -u origin master --force
echo Done!
pause

