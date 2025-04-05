# 🚚 Transport Time Calculator

A web tool that helps calculate transit times between business ZIP codes and facilities (plants), based on carrier data. Useful for logistics, planning, and delivery schedule management.

---

## 📌 Features

- ✅ Filter by **Inbound ZIP** and **Outbound Plant**
- 📅 Choose a **desired delivery date** to calculate required shipping date
- 🧠 Intelligent filtering with **debounce** to prevent performance issues
- 🧮 Dynamically shows only relevant carriers for the selected route
- 🌓 **Dark/Light mode toggle** with system and saved preference support
- 🔄 Full **Reset** functionality

---

## 🖥️ Usage

1. **Enter an Inbound ZIP code**
2. **Select an Outbound Plant** from the dropdown (UWPJ, UWPS, UWPT, etc.)
3. Optionally choose a **desired delivery date**
4. Click **"Check Days"** to calculate transit time
5. Use **"Reset Search"** to start over
6. Toggle **🌙/☀️** to change between dark and light themes

---

## 📁 File Structure

├── index.html        # Main UI
├── styles.css        # Custom styles and dark mode logic
├── script.js         # Core logic (debounced filtering, calculations, theming)
├── UWPJ.json         # Sample carrier time data per plant
├── UWPS.json         # Other plant JSONs...
└── ...
