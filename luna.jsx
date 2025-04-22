module.exports = {
  refreshFrequency: 21600000, // Update every 6 hours

command: `
    # Wait for network availability
    until ping -c 1 8.8.8.8 &> /dev/null; do
      echo "Waiting for network to be available..."
      sleep 5
    done

    # Only refresh Übersicht once to prevent infinite loop
    if [ ! -f "/tmp/ubersicht_refreshed" ]; then
      osascript -e 'tell application "Übersicht" to refresh'
      touch /tmp/ubersicht_refreshed  # Prevent future refresh loops
    fi

    # Check if script.sh exists and is executable
    if [ -x "LunaPhase.widget/script.sh" ]; then
      LunaPhase.widget/script.sh
    else
      echo "script.sh not found or not executable"
    fi

    # Wait for moon data to exist and be valid
    until [ -s "LunaPhase.widget/tmp/moon_data" ]; do
      echo "Waiting for moon data..."
      sleep 5
    done

    # Extract moon data and timestamp
    awk 'NR>=3 && NR<=5' LunaPhase.widget/tmp/moon_data

    # Get timestamp
    echo "$(tail -n 1 'LunaPhase.widget/tmp/TIMESTAMP' 2>/dev/null || echo "No Timestamp Available")"
`,


  render: function ({ output }) {
    // Provide a fallback for output if it's undefined
    const safeOutput = output || "";

    // Split the output into lines safely
    const lines = safeOutput.split("\n");

    // Get moon data and timestamp
    const moonTitle = lines[0] || "Moon: No Data"; // First line as title
    const moonDataLines = lines.slice(0, 3).join("\n") || "No Moon Data Available"; // Lines 3-5
    const timestampLine = lines[3] || "No Timestamp Available"; // Line after moon data

    // Image Path
    const imagePath = 'LunaPhase.widget/tmp/current_moon.png';

    // Widget Styles
    const widgetStyles = {
      position: "absolute",
      top: "50px",
      left: "340px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: "Epilogue, SF Pro, SF Compact Text, Hack Nerd Font, Arial, sans-serif",
      color: "lightgrey",
      background: "rgba(0, 0, 0, 0.01)",
      borderRadius: "5px",
      padding: "10px",
      maxWidth: "200px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.03)",
    };
    
    const imageWrapperStyles = {
      position: "relative",
      borderRadius: "50%",
      overflow: "hidden",
      width: "150px",
      height: "150px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: "15px",
    };

    const imageStyles = {
      width: "106%",
      height: "106%",
      objectFit: "cover",
    };

    const infoStyles = {
      textAlign: "center",
    };

    const timestampStyles = {
      fontSize: "8px",
      marginBottom: "5px",
      color: "grey",
      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
      marginTop: "-8px",
    };

    const moonDataStyles = {
      fontSize: "16px",
      fontWeight: "500",
      marginTop: "-10px",
      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
      textShadow: 
      "2px 2px 4px rgba(0, 0, 0, 1), " +
      "0 0 5px rgba(255, 165, 0, 0.2), " +
      "0 0 10px rgba(255, 165, 0, 0.3), " +
      "0 0 20px rgba(255, 165, 0, 0.4)"
    };

    const suncalcStyles = {
      fontSize: "12px",
      fontWeight: "500",
      marginTop: "-10px",
      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
      textShadow: 
      "2px 2px 4px rgba(0, 0, 0, 1), " +
      "0 0 5px rgba(255, 165, 0, 0.2), " +
      "0 0 10px rgba(255, 165, 0, 0.3), " +
      "0 0 20px rgba(255, 165, 0, 0.4)"
    };

    const suncalcLabelStyles = {
      fontSize: "12px",
      fontWeight: "500",
      marginTop: "0px",
      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
      textShadow: 
      "2px 2px 4px rgba(0, 0, 0, 1), " +
      "0 0 5px rgba(255, 165, 0, 0.2), " +
      "0 0 10px rgba(255, 165, 0, 0.3), " +
      "0 0 20px rgba(255, 165, 0, 0.4)"
    };

    const fontFaces = [
      {
        fontFamily: "Epilogue",
        src: "url('LunaPhase.widget/fonts/Epilogue-Regular.woff2') format('woff2')",
        fontWeight: "400",
        fontStyle: "normal"
      },
      {
        fontFamily: "Epilogue Medium",
        src: "url('LunaPhase.widgetfonts/Epilogue-Medium.woff2') format('woff2')",
        fontWeight: "100",
        fontStyle: "normal"
      },
      {
        fontFamily: "Epilogue Bold",
        src: "url('LunaPhase.widgetfonts/Epilogue-Bold.woff2') format('woff2')",
        fontWeight: "100",
        fontStyle: "normal"
      },
      {
        fontFamily: "Epilogue SemiBold",
        src: "url('LunaPhase.widgetfonts/Epilogue-SemiBold.woff2') format('woff2')",
        fontWeight: "100",
        fontStyle: "normal"
      }
    ];
    
    // Function to inject @font-face rules dynamically
    const injectFonts = (fonts) => {
      const style = document.createElement("style");
      document.head.appendChild(style);
      const sheet = style.sheet;
    
      fonts.forEach(font => {
        const rule = `
          @font-face {
            font-family: '${font.fontFamily}';
            src: ${font.src};
            font-weight: ${font.fontWeight};
            font-style: ${font.fontStyle};
          }
        `;
        sheet.insertRule(rule, sheet.cssRules.length);
      });
    };
    
    // Apply fonts
    injectFonts(fontFaces);
    
const SunCalc = require('suncalc');

// Get current date
const now = new Date();
const moonIllumination = SunCalc.getMoonIllumination(now);
const moonTimes = SunCalc.getMoonTimes(now, 0, 0); // Lat: 0, Lon: 0 (GMT)

// Moon phase mapping
const moonPhases = [
    "New Moon", "Waxing Crescent", "First Quarter",
    "Waxing Gibbous", "Full Moon", "Waning Gibbous",
    "Last Quarter", "Waning Crescent"
];

// Convert moon phase (0-1) to phase name
const phaseIndex = Math.floor(moonIllumination.phase * 8);
const moonPhase = moonPhases[phaseIndex];

/**
 * Find the next full moon or new moon.
 * @param {Date} fromDate - Start date for calculation.
 * @param {boolean} fullMoon - If true, finds full moon; otherwise finds new moon.
 * @returns {Date} The next full or new moon date.
 */
function findNextLunarPhase(fromDate, fullMoon = true) {
    let testDate = new Date(fromDate);
    const synodicMonth = 29.53 * 24 * 60 * 60 * 1000; // Convert days to ms

    for (let i = 0; i < 30; i++) { // Look up to 30 days ahead
        testDate = new Date(testDate.getTime() + (24 * 60 * 60 * 1000)); // Add one day
        const testIllumination = SunCalc.getMoonIllumination(testDate);
        if (fullMoon && testIllumination.phase >= 0.48 && testIllumination.phase <= 0.52) {
            return testDate;
        }
        if (!fullMoon && (testIllumination.phase <= 0.02 || testIllumination.phase >= 0.98)) {
            return testDate;
        }
    }

    return new Date(fromDate.getTime() + synodicMonth); // Fallback estimate
}

const nextFullMoon = findNextLunarPhase(now, true);
const nextNewMoon = findNextLunarPhase(now, false);

console.log(`Moon Age: Approximate`);
console.log(`Moon Phase: ${moonPhase}`);
console.log(`Illumination: ${(moonIllumination.fraction * 100).toFixed(2)}%`);
console.log(`Distance: ~384400 km`); // Approximate distance
console.log(`Next Moonrise: ${moonTimes.rise ? moonTimes.rise.toUTCString() : "N/A"}`);
console.log(`Next Moonset: ${moonTimes.set ? moonTimes.set.toUTCString() : "N/A"}`);
console.log(`Next Full Moon: ${nextFullMoon.toUTCString()}`);
console.log(`Next New Moon: ${nextNewMoon.toUTCString()}`);

    return (
      <div style={widgetStyles}>
        {/* Image Wrapper */}
        <div style={imageWrapperStyles}>
          <img
            src={imagePath}
            alt="Current Moon Image"
            style={imageStyles}
          />
        </div>
        {/* Moon Data Display */}
        <div style={infoStyles}>
          <p style={moonDataStyles}>{moonDataLines}</p>
          <div style={infoStyles}>
            <p className="timestamp" style={timestampStyles}>
              {timestampLine}
            </p>
          </div>
        {/*
        <div style={infoStyles}>
          <p style={suncalcLabelStyles}>Next Full Moon:</p>
          <p style={suncalcStyles}>{nextFullMoon.toDateString()}</p>
          <p style={suncalcLabelStyles}>Next New Moon:</p>
          <p style={suncalcStyles}>{nextNewMoon.toDateString()}</p>  
        </div>
        */}
        </div>
      </div>
    );
  }
};