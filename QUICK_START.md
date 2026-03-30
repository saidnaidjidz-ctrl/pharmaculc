# 🚀 Quick Start Guide - PharmCalc

## Installation

**No installation needed!** Just open `index.html` in your web browser.

### Step 1: Open the Application
- Double-click `index.html` in your browser or
- Drag `index.html` into your browser window or
- Right-click `index.html` → Open with → Your Browser

### Step 2: Start Calculating

#### First Time Users - Follow This Path:

1. **Page 1: Basic Semester Calculator** (Perfect for quick calculations)
   - Enter your grades for the 6 pharmacy subjects
   - Click "Calculate"
   - See your weighted average instantly

2. **Page 3: Custom Calculator** (For custom subjects)
   - Click "Add Subject"
   - Fill in subject details
   - Enter your grades
   - Click "Calculate"

3. **Page 4: Dashboard** (See your overall performance)
   - View your cumulative average
   - Check performance indicators
   - Export your results as PDF

## 5-Minute Tutorial

### Tutorial 1: Basic Calculator
```
1. Go to Page 1 (or press Alt+1)
2. Enter a grade for "Organic" (e.g., 15)
3. Enter a grade for "Cell Biology" (e.g., 16)
4. Click "Calculate"
5. See your weighted average!
```

### Tutorial 2: Custom Calculator
```
1. Go to Page 3 (or press Alt+3)
2. Click "Add Subject"
3. Enter name: "Chemistry"
4. Set coefficient: 2
5. Number of exams: 2
6. Click "Add Subject"
7. Now you'll see the Chemistry card
8. Enter exam grades
9. Click "Calculate"
```

### Tutorial 3: Dashboard
```
1. Go to Page 4 (or press Alt+4)
2. See all your averages in one place
3. Click "Export as PDF" to download your report
```

## Common Tasks

### How to...

**Enter Grades**
- Click on input field
- Type a number from 0 to 20
- Use decimal values (e.g., 15.5) for precision

**Calculate Results**
- Make sure you've entered at least one grade
- Click the "Calculate" button (green)
- Results appear below

**Reset Your Data**
- Page-Level: Click "Reset" on the page
- All Data: Dashboard → "Reset All Data"
- ⚠️ Cannot be undone!

**Export Your Results**
- PDF: Dashboard → "Export as PDF" → Print or save
- JSON: Dashboard (coming soon)
- CSV: Dashboard (coming soon)

**Enable Dark Mode**
- Click the moon icon (☾) in top-right
- Or press Alt+D
- Saves automatically

**Get Help**
- Click the question mark (?) icon
- Or press F1 (browser help)
- Check README.md for detailed info

## File Organization

Keep all files in the same folder:
```
📁 pharmacalc/
  ├─ 📄 index.html          ← OPEN THIS FILE
  ├─ 📁 styles/
  │   └─ 📄 styles.css
  ├─ 📁 js/
  │   ├─ 📄 app.js
  │   ├─ 📄 storage.js
  │   ├─ 📄 calculator.js
  │   ├─ 📄 ui-utils.js
  │   ├─ 📄 pdf-export.js
  │   ├─ 📄 page1.js
  │   ├─ 📄 page2.js
  │   ├─ 📄 page3.js
  │   └─ 📄 page4.js
  └─ 📄 README.md
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Alt + 1` | Basic Semester Page |
| `Alt + 2` | Structured Page |
| `Alt + 3` | Custom Page |
| `Alt + 4` | Dashboard |
| `Alt + D` | Toggle Dark Mode |
| `Esc` | Close Pop-ups |
| `Tab` | Navigate form fields |

## Features Overview

### 🧮 Page 1: Basic Semester
- 6 predefined pharmacy subjects
- Fixed coefficients (already set)
- Best for: Quick calculations

### 📋 Page 2: Structured
- Multiple tests/exams per subject
- TP/TD grades for some subjects
- Best for: Detailed tracking

### ✨ Page 3: Custom
- Add unlimited subjects
- Set your own coefficients
- Choose number of grades
- Best for: Personalized grading

### 📊 Page 4: Dashboard
- Overall performance view
- Export options
- Performance indicators
- Best for: Tracking progress

## Performance Calculation

### How Weighted Average Works

**Formula:** (Grade₁ × Coef₁ + Grade₂ × Coef₂ + ...) ÷ (Coef₁ + Coef₂ + ...)

**Example:**
- Organic: 15 × 3 = 45
- Chemistry: 16 × 2 = 32
- Total: (45 + 32) ÷ (3 + 2) = 77 ÷ 5 = **15.4**

### Status Indicators

| Average | Status | Color |
|---------|--------|-------|
| ≥ 14 | ✅ Excellent | Green |
| 10-14 | ⚠️ Medium | Orange |
| < 10 | ❌ Weak | Red |

## Data Storage

Your data is saved automatically in your browser:
- ✅ **Safe**: Only visible to you
- ✅ **Private**: Not sent to any server
- ✅ **Persistent**: Survives browser restart
- ⚠️ **Browser-specific**: Different browser = different data
- ⚠️ **Clearing cache**: Deletes your data

### Back Up Your Data
1. Go to Dashboard (Page 4)
2. Click "Export as PDF" or "Export JSON"
3. Save file to your computer
4. You can import it later if needed

## Troubleshooting

### "My data disappeared!"
- Try: Refresh the page (F5)
- Try: Clear browser cache and reload
- Try: Try a different browser

### "Grades aren't calculating"
- Check: Did you click "Calculate" button?
- Check: Are all grades between 0-20?
- Check: Did you enter at least one grade?

### "How do I delete just one subject?"
- Page 1 & 2: Just clear the field and recalculate
- Page 3: Click the red "Remove" button on the subject card

### "Can I use this offline?"
- Yes! PharmCalc works completely offline
- Data saved locally on your device

## Tips & Tricks

### 💡 Pro Tips

1. **Use Tab key** to quickly move between fields
2. **Always export** a backup of your data
3. **Check Dashboard** weekly to track your progress
4. **Use Custom page** for non-standard subjects
5. **Dark mode** is great for studying late

### ⚡ Speed Tips

1. Use Alt+1, Alt+2, Alt+3, Alt+4 to jump between pages
2. Press Tab to move quickly through form fields
3. Press Enter to submit after entering last grade
4. Use custom subjects for repeated calculations

## Getting Help

1. **In-App Help**: Click the "?" icon in the navbar
2. **This File**: Read this quick start guide
3. **README.md**: Comprehensive documentation
4. **Browser Console**: Press F12 for debugging

## Browser Settings

### Enable Local Storage
- Chrome: Settings → Privacy → Allow all sites to store data
- Firefox: Privacy → Allow local data storage
- Safari: Privacy → Allow for websites I visit
- Edge: Privacy → Allow local data storage

### For Full Functionality
- Enable JavaScript (required)
- Enable cookies (optional, for Dark Mode setting)
- Allow Browser Storage (required)

## What's Next?

After learning basics:

1. **Explore Page 2**: Learn structured grading
2. **Master Page 3**: Create custom subjects
3. **Monitor Page 4**: Track your overall performance
4. **Export Data**: Back up your important grades
5. **Share Results**: Export PDF and share with advisors

## Common Questions

**Q: Is my data secure?**
A: Yes, it's stored locally on your device only.

**Q: Can I access this on multiple devices?**
A: Not yet. Future: Cloud sync feature coming.

**Q: What if I close the browser?**
A: Your data is saved and will be there when you reopen.

**Q: Can I delete specific grades?**
A: Page 3: Yes, with Remove buttons. Pages 1 & 2: Clear field and recalculate.

**Q: How many subjects can I add?**
A: Unlimited in Page 3! Add as many as you need.

**Q: How accurate is the calculation?**
A: Uses standard weighted average formula - 100% accurate.

**Q: Can I export as PDF?**
A: Yes! Dashboard → Export as PDF

**Q: Do I need internet?**
A: No, works completely offline.

**Q: Is there a mobile app?**
A: Web app is responsive for phones/tablets. Native app coming soon.

**Q: How do I transfer data to new phone?**
A: Export as JSON or PDF, then import on new device.

## Need More Help?

📖 **Full Documentation**: Open `README.md`
❓ **In-App Help**: Click "?" button
🔧 **Browser Console**: Press F12 → Console tab
💬 **Contact Support**: Check README for contact info

---

## Let's Get Started! 🚀

1. ✅ Open `index.html` in browser
2. ✅ Press Alt+1 to go to Basic Calculator
3. ✅ Enter a grade (0-20)
4. ✅ Click "Calculate"
5. ✅ You've got your first result!

**Welcome to PharmCalc! Happy calculating! 📊🧬**

---

**Pro Tip:** Bookmark this page for easy access!
