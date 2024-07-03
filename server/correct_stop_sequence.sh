#!/bin/bash

# Check if the correct number of arguments is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 input_file"
    exit 1
fi

# Input and output files from command-line arguments
input_file="$1"

# Utiliser sed pour remplacer le texte
sed -i '' "s/IDFM:monomodalStopPlace:47187,15/IDFM:monomodalStopPlace:47187,1/g" "$input_file"
echo "Remplacement de IDFM:monomodalStopPlace:47187,15 par IDFM:monomodalStopPlace:47187,1"
sed -i '' "s/IDFM:monomodalStopPlace:47184,16/IDFM:monomodalStopPlace:47184,2/g" "$input_file"
echo "Remplacement de IDFM:monomodalStopPlace:47184,16 par IDFM:monomodalStopPlace:47184,2"
sed -i '' "s/IDFM:monomodalStopPlace:47158,17/IDFM:monomodalStopPlace:47158,3/g" "$input_file"
echo "Remplacement de IDFM:monomodalStopPlace:47158,17 par IDFM:monomodalStopPlace:47158,3"
sed -i '' "s/IDFM:monomodalStopPlace:47914,18/IDFM:monomodalStopPlace:47914,4/g" "$input_file"
echo "Remplacement de IDFM:monomodalStopPlace:47914,18 par IDFM:monomodalStopPlace:47914,4"
sed -i '' "s/IDFM:monomodalStopPlace:47171,19/IDFM:monomodalStopPlace:47171,5/g" "$input_file"
echo "Remplacement de IDFM:monomodalStopPlace:47171,19 par IDFM:monomodalStopPlace:47171,5"
sed -i '' "s/IDFM:monomodalStopPlace:47174,20/IDFM:monomodalStopPlace:47174,6/g" "$input_file"
echo "Remplacement de IDFM:monomodalStopPlace:47174,20 par IDFM:monomodalStopPlace:47174,6"
sed -i '' "s/IDFM:monomodalStopPlace:47181,21/IDFM:monomodalStopPlace:47181,7/g" "$input_file"
echo "Remplacement de IDFM:monomodalStopPlace:47181,21 par IDFM:monomodalStopPlace:47181,7"

echo "Remplacement terminé."

echo "Processing complete. Updated file saved as $input_file."