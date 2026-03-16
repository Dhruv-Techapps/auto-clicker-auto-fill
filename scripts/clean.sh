#!/bin/bash

# Remove build artifacts from all packages and apps
for dir in packages/* apps/*; do
  if [ -d "$dir" ]; then
    find "$dir" -type d \( -name "dist" -o -name "out-tsc" -o -name "test-output" -o -name "node_modules" \) -exec rm -rf {} +
  fi
done

echo "Cleaned dist/, out-tsc/, test-output/, and node_modules/ from all packages and apps."
# Remove .nx folder from workspace root
rm -rf .nx

echo "Cleaned dist/, out-tsc/, test-output/, node_modules/ from all packages and apps, and .nx from workspace root."
