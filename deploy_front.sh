#!/bin/bash

APP="Ambassadors"

cf ssh ${APP} -c "rm app/build/static/css/* app/build/static/js/* app/build/index.html"
./cf-scp.sh ${APP} "build/static/css/*" app/build/static/css
./cf-scp.sh ${APP} "build/static/js/*" app/build/static/js
./cf-scp.sh ${APP} "build/locales/es/*" app/build/locales/es
./cf-scp.sh ${APP} build/index.html app/build/index.html
