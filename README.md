# 🌙 LunaPhase Übersicht Widget

Displays the current moon phase, illumination, and other lunar details in Übersicht on macOS. Automatically refreshes twice a day and visualizes data with a themed interface and a moon image.

## Requirements

### macOS System
- macOS with [Übersicht](http://tracesof.net/uebersicht/) installed

### Node.js Environment
- [Node.js](https://nodejs.org/en/) (required for lunar calculations)
- Node module: `suncalc`

### Shell Script
- `script.sh` generates moon data, timestamp, and image
- Must be executable:
  ```sh
  chmod +x LunaPhase.widget/script.sh
  ```

## 📁 Folder Structure

```
LunaPhase.widget/
├── index.js                 # Übersicht widget logic
├── script.sh                # Bash script to fetch or generate moon data
├── fonts/
│   └── Epilogue-*.woff2     # Custom fonts
├── tmp/
│   ├── moon_data            # Output from script.sh (lunar info)
│   ├── TIMESTAMP            # Last update time
│   └── current_moon.png     # Moon phase image
├── package.json             # Node dependencies (SunCalc)
└── node_modules/
    └── suncalc/
```

## Setting Up Node.js Support (`suncalc`)

This widget uses the [`suncalc`](https://www.npmjs.com/package/suncalc) Node.js module to calculate moon phases and illumination.

### Step-by-Step Instructions

1. **Install Node.js** (if not already installed)  
   On macOS, use Homebrew:
   ```sh
   brew install node
   ```

2. **Navigate to the widget folder**  
   ```sh
   cd ~/Library/Application\ Support/Übersicht/widgets/LunaPhase.widget
   ```

3. **Initialize the folder as a Node project**
   ```sh
   npm init -y
   ```

4. **Install `suncalc`**
   ```sh
   npm install suncalc
   ```

5. **Ensure `script.sh` is executable**
   ```sh
   chmod +x script.sh
   ```

6. **Run `script.sh` manually to generate moon data**
   ```sh
   ./script.sh
   ```

## 🌔 How the Widget Chooses the Moon Phase Image

The widget uses `suncalc` to calculate the current moon phase as a value from `0.0` to `1.0`, which is then mapped to one of eight common moon phases:

```js
const moonPhases = [
  "New Moon", "Waxing Crescent", "First Quarter",
  "Waxing Gibbous", "Full Moon", "Waning Gibbous",
  "Last Quarter", "Waning Crescent"
];

const phaseIndex = Math.floor(moonIllumination.phase * 8);
const moonPhase = moonPhases[phaseIndex];
```

## Moon Image Selection

The image shown in the widget (`tmp/current_moon.png`) reflects the current north hemisphere moon phase. The south hemisphere images are not included.

### Static Moon Phase Images (Included)

This widget currently uses a set of **pre-downloaded static images** for each moon phase. These were originally sourced from NASA’s [Daily Moon Guide](https://moon.nasa.gov/moon-observation/daily-moon-guide) and manually matched to approximate phase names.

These images are **not dynamically updated**, but they are **visually accurate and close enough** for most casual users.

Example usage:
```sh
cp images/${moonPhase}.png tmp/current_moon.png
```

### Extend It Yourself (If you like)

Advanced users can modify the widget to fetch **daily-updated images from NASA** using their public web assets.

Suggested pattern:
```sh
TODAY=$(date +"%Y-%m-%d")
curl -o tmp/current_moon.png "https://moon.nasa.gov/system/feature_items/images/${TODAY}-moon.png"
```

**Note**: This logic is **not implemented by default**, but you can build it into `script.sh` if desired.


## Fonts & Styling

- Uses the `Epilogue` font family
- Font files (`.woff2`) must exist in `fonts/` and be referenced correctly
- The moon image is displayed in a circular frame with styled text overlays

## Troubleshooting

| Problem | Cause | Solution |
|--------|-------|----------|
| `Cannot find module 'suncalc'` | `suncalc` not installed | Run `npm install suncalc` in the widget directory |
| `script.sh not found or not executable` | Missing or bad permissions | Run `chmod +x script.sh` |
| Moon data is blank | `moon_data` not generated | Manually run `./script.sh` and check `tmp/` output |
| Fonts not working | Missing or misnamed `.woff2` files | Check file paths and `font-family` references |
| No moon image | Image not created | Ensure `script.sh` creates `tmp/current_moon.png` |


## Quick Summary

- Install Node.js and `suncalc`
- Run `script.sh` to generate moon data and image
- Übersicht renders output from `moon_data`, `TIMESTAMP`, and `current_moon.png`
- Image can be static or fetched from NASA’s Moon Guide

---

# Attribution & Credits

This widget was inspired by multiple community projects, specifically:

**ASTRO_NERD**  
- Author: Tink-rs (A girl who loves Conky & Coding)  
- License: GNU GPLv3 – 2022  
- Source: https://www.gnu.org/licenses/gpl.html  
- Original components:
  - MoonMini (forked from MoonGiant by @unklar on GitHub)
  - Bargraph Lua by Wlouf on DeviantArt

**This LunaPhase widget** is a custom Übersicht implementation that borrows conceptual ideas from these projects but is built using JavaScript, Node.js, and NASA image sources.  
This widget itself is released into the public domain under The Unlicense.

## Images

Moon phase images used in this widget are sourced from NASA’s [Daily Moon Guide](https://moon.nasa.gov/moon-observation/daily-moon-guide).  
They are used under NASA’s public domain guidelines for non-commercial, educational, and informational purposes.

NASA does not endorse this widget or any derivative use.


## License

This widget is released under [The Unlicense](https://unlicense.org/), placing it in the public domain.

You are free to use, modify, distribute, or build on this project without restriction.
