# 🚀 دليل نشر PharmCalc على Firebase

## الخطوات:

### 1️⃣ إنشاء حساب Firebase
- اذهب إلى: https://firebase.google.com
- انقر على "Get Started" (ابدأ)
- سجل دخولك بحساب Google

### 2️⃣ إنشاء مشروع جديد
- في Firebase Console: https://console.firebase.google.com
- انقر على "Create Project" (إنشاء مشروع)
- اسم المشروع: "PharmCalc" (أو اسم آخر)

### 3️⃣ تفعيل Firebase Hosting
- في المشروع الجديد → اختر "Hosting" من القائمة اليسرى
- انقر "Get Started"

### 4️⃣ تسجيل الدخول محلياً

**في PowerShell - قم بتشغيل:**

```powershell
cd "c:\Users\saidn\AppData\Local\Programs\Microsoft VS Code\bin\Nouveau dossier\pharmacalc"
firebase login
```

- ستفتح نافذة متصفح
- سجل دخولك بحساب Google
- وافق على الأذونات

### 5️⃣ ربط المشروع

```powershell
firebase init hosting
```

الإجابات:
- "Use existing project?" → Yes
- اختر المشروع الذي أنشأته
- "What do you want to use as your public directory?" → . (نقطة)
- "Configure as a single-page app?" → Yes
- "Set up automatic builds and deploys?" → No

### 6️⃣ النشر

```powershell
firebase deploy
```

### ✅ تم!
ستحصل على رابط موقعك مثل:
```
https://your-project.web.app
```

---

## ملاحظات مهمة:
- ✅ firebase.json موجود بالفعل
- ✅ التطبيق مهيأ للنشر
- 🔐 استخدم حسابك على Google
- 📱 التطبيق يعمل كـ PWA (تطبيق ويب متقدم)
- 💾 البيانات تُحفظ محلياً في هاتف/جهازك
