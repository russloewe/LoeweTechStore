#!/bin/bash
 #######################
 #######################
# DEV 
HOME=/home/russell
APPNAME=appname		
APPROOT="$HOME/$APPNAME"
DEVPORT=3000
DBUSER=appname
DBPASS=database-password
DBHOST=127.0.0.1
DBPORT=5432
DBDATA=appname
DEV_DB_URL="postgre://$DBUSER:$DBPASS@$DBHOST:$DBPORT/$DBDATA"

# PROD
SITE_URL='https://'
DBPHOST=34.82.54.240
PRODPORT=3000
PROD_DB_URL="postgre://$DBUSER:$DBPASS@$DBPHOST:$DBPORT/$DBDATA"
ADMIN_NAME="admin user name"
ADMIN_PASS="admin user password"
ADMIN_EMAIL="adminstrator email"

STRIPE_SERVER_KEY=sk_test_51GyrVjGXUn6tz3yAnmcx4zI7Dl8Df5EdopPyuBH35UIgFDOtlJvzvF3oC2ObLoU1ZdwiGRT5PKMfTNhQat8vSC6V00b85Ky6Xm
CONNECTED_STRIPE_ACCOUNT_ID=test

G_ANALYTICS_KEY=analytics-key



# Build Server side typescript source files
build_typescript() {
    echo "Cleaning build files..."
    rm -r $HOME/$APPNAME/build
    echo "Building server side Typescript files"
    declare -a sources=('core' 'store'  )
    for i in "${sources[@]}"
    do
        BUILD="$HOME/$APPNAME/src/$i"
        echo "Building $BUILD"
        cd $BUILD
        tsc -p $BUILD/tsconfig.json
    done
}

bundle_server() {
    echo "Bundling server with webpack"
    cd $APPROOT
    webpack-cli --config ./webpack-server.config.js 
}

# Build the Javascript bundle.js package
build_js_development () {
    echo "Building Development bundle with webpack"
     webpack-cli --config ./webpack-client.config.js >&2

}

build_js_production () {
    echo "Building with webpack"
     webpack-cli --config ./webpack-client-prod.config.js >&2
}


# Build the HTML pages with pug
build_html () {
	echo "Building static HTML with pug"
	declare -a pages=("index" "legal" )

	for i in "${pages[@]}"
	do
		rm ./public/"$i".html 2>/dev/null
		pug  ./src/core/views/"$i".pug  -o ./public -P >&2
	done
}


# Run the server
run_development() {
    echo "Launching node in development..."
      G_ANALYTICS_KEY=$G_ANALYTICS_KEY \
      G_RECAPTCHA_CLIENT=$RECAPTCHA_CLIENT_KEY \
      DATABASE_URL=$DEV_DB_URL \
      STRIPE_SERVER=$STRIPE_SERVER_KEY \
      CONNECTED_STRIPE_ACCOUNT_ID=$CONNECTED_STRIPE_ACCOUNT_ID \
      SITE_URL='http://127.0.0.1:3000/' \
      AUTHORITY=http \
      ENV="dev" \
      PORT=$DEVPORT \
      node ./server-bundle.js
}

run_production () {
	  echo "Launching node in production..."
#/opt/$APPNAME/node ./bin/www &> /var/log/$APPNAME.log
	  G_ANALYTICS_KEY=$G_ANALYTICS_KEY \
      G_RECAPTCHA_CLIENT=$RECAPTCHA_CLIENT_KEY \
      G_RECAPTCHA_SERVER=$RECAPTCHA_SERVER_KEY \
      DATABASE_URL=$PROD_DB_URL \
      STRIPE_SERVER=$STRIPE_SERVER_KEY \
      CONNECTED_STRIPE_ACCOUNT_ID=$CONNECTED_STRIPE_ACCOUNT_ID \
      NODE_ENV=production \
      ENV=prod \
      SITE_URL=$SITE_URL\
      AUTHORITY=https \
      PORT=$PRODPORT \
      node ./server-bundle.js
}


init_database() {
    # $1 - Database URL, postgresql with creds
    declare -a files=(\
        "users.sql"\
        "session.sql"\ 
        "customers.sql"\
        "store.sql"\
        "storeProducts.sql"
    )
	echo "Running SQL Files:" 
	for i in "${files[@]}"
	do
        echo "-->node ./db/runsql.js $i $DEV_DB_URL"
		node ./db/runsql.js $i $1
	done
    echo "Adding admin"
    node ./db/initAdmin.js $ADMIN_NAME $ADMIN_PASS $1 $ADMIN_EMAIL
}

 
gitArchive () {
    OUTNAME="$2"_$(echo `date +%m-%d_%H%M`).zip
    OUTPATH=$HOME/Dropbox/Websites/
    OUT="$OUTPATH""$OUTNAME"
    IN="$1""$2"
    echo "Archiving Git to $OUT"
    git archive --format zip -9 HEAD -o $OUT
    echo "Done"
}


# Run tests
test_development () {
	echo "Running tests with local database"
     DATABASE_URL=postgre://$DBUSER:$DBPASS@$DBHOST:$DBPORT/$DBDATA \
     NODEENV=dev \
     ./node_modules/.bin/mocha --exit ./build/test/*.js

}

test_production () {
	echo "Running tests with production database"
   DATABASE_URL=postgre://$DBUSER:$DBPASS@$DBPHOST:$DBPORT/$DBDATA \
     NODEENV=production \
     npm test
}




while getopts ":hijJcCrRdDtTasbB" opt; do
        case ${opt} in
    h|\?)
      echo "-i       Install"
      echo "-j       Build JS bundle"
      echo "-J       Build JS bundle (Production)"
      echo "-c       Build HTML "
      echo "-C       Build HTML (Production)"
      echo "-r       Run application port: $DEVPORT"
      echo "-R       Run application (Production) port: $PRODPORT "
      echo "-d       Initialize database - $DBHOST:$DBPORT"
      echo "-D       Initialize database (Production) - $DBPHOST:$DBPORT"
      echo "-t       Test"
      echo "-T       Test (production)"
      echo "-b       Build Server Typescript sources"
      echo "-B       Bundle server with webpack"
      echo "-a       Archive to Dropbox"
      echo "-s       docker reg"
      exit 1
      ;;
    i) install ;;
    b) build_typescript ;;
    B) bundle_server ;;
    c) build_html dev;;
    C) build_html prod;;
    j) build_js_development ;;
    J) build_js_production;;
    s) initDockerReg ;;
    r) run_development ;;
    R) run_production ;;
    t) test_development ;;
    T) test_production ;;
    d) init_database $DEV_DB_URL;;
    D) init_database $PROD_DB_URL;;
    a) gitArchive $HOME $APPNAME;;
     *) echo "Unknown option" 
        break   ;;
  esac
done
exit 0
