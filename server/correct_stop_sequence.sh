#!/bin/bash

# Check if the correct number of arguments is provided
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 input_file output_file"
    exit 1
fi

# Input and output files from command-line arguments
input_file="$1"
output_file="$2"

# Use awk to process the file
awk -F, 'BEGIN { OFS="," }
{
    if (NR == 1) {
        # Print the header
        print $0
    } else {
        if ($1 == prev_trip_id) {
            # Increment stop_sequence if trip_id is the same as previous
            $5 = prev_stop_sequence + 1
        }
        # If trip_id is different, keep stop_sequence as is
    }
    # Update previous trip_id and stop_sequence for the next iteration
    prev_trip_id = $1
    prev_stop_sequence = $5
    print $0
}' "$input_file" > "$output_file"

echo "Processing complete. Updated file saved as $output_file."