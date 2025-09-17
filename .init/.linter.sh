#!/bin/bash
cd /home/kavia/workspace/code-generation/ghostly-wordle-party-14219-14245/wordle_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

