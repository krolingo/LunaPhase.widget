#!/bin/sh

# Directory containing the .jpg files
INPUT_DIR="/home/mcapella/.config/conky/organized/conky_moon/astro_nerd_ripped/tmp/"
# Directory to save the .png files
OUTPUT_DIR="/home/mcapella/.config/conky/organized/conky_moon/astro_nerd_ripped/converted/"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Loop through all .jpeg files in the input directory
for file in "$INPUT_DIR"/*.jpg; do
  # Extract the base name of the file (without extension)
  base_name=$(basename "$file" .jpg)
  # Convert the file to .png and save it in the output directory
  convert "$file" "$OUTPUT_DIR/$base_name.png"
done
