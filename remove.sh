#!/bin/zsh

# List all folders and subfolders in order, ignore "src" folders
TARGET_DIR="./packages"

for parent in "$TARGET_DIR"/*/; do
    parent_name=$(basename "${parent%/}")
    
    for child in "$parent"*/; do
        [[ -d "$child" ]] || continue
        child_name=$(basename "${child%/}")

# Define the specific files to modify
FILES=(
  "/Users/dharmeshpatel/Documents/GitHub/dhruv-techapps/packages/$parent_name/$child_name/tsconfig.lib.json"
)

# Loop through the files and remove the specified lines
for file in "${FILES[@]}"; do
  if [[ -f "$file" ]]; then
    echo "Processing $file..."
    
    # Use sed to remove the lines containing "module": "nodenext" and "moduleResolution": "nodenext"
    sed -i '' '/"module": "nodenext",/d' "$file"
    sed -i '' '/"compilerOptions": {/a\
    \    "lib": ["dom"],
    ' "$file"
    sed -i '' '/"moduleResolution": "nodenext",/d' "$file"
    
    echo "Updated $file"
  else
    echo "File not found: $file"
  fi
done

echo "Operation completed!"

 done
done
