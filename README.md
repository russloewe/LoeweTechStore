# LoeweTechStore
A simple one page e-store implemented with NodeJs and Stripe

# Environment:

    Linux, NodeJs, Docker, React, PostgreSQL, Stripe
    
# Install 

    Most of the installation process is accompolished with the ./load.sh
    shell script. run ./load.sh -h for a list of commands.
    
## Configuration

    Before building the source files, configure site specific values. 
    
    edit: 
        
        ./views/options.pug
        
    to change things that get rendered into the HTML bundle such as
    OG meta tags, and the site URL for fetching resources.
    
    edit:
    
        ./load.sh
        
    to change environment variables passed to the NodeJs app like 
    database credentials and the Stripe server key. All variables are 
    defined at the top of the file.
    
    
    
## Build Client:

    invoke the webpack bundler in development or production mode with
    
        ./load.sh -j
        ./load.sh -J
        
    respectively.
    
    This will produce the JS bundle in ./public/js/bundle.js

## Build Server:

    Transpile Typescript source files with
    
        ./load.sh -b
        
    which will build to ./build
    
    Bundle Javascript files using Webpack with
    
        ./load.sh -B
        
    This will create JS Node app ./server-bundle.js
    
## Containerize the App:

    Bundle the app into a Docker container:
    
        docker build ./ -t app-name
        
## Initialize the Database

    First, create a PostgreSQL server, and then a login role and database
    for the app. Save the info into the ./load.sh script. Then setup the 
    local development or remote production database with:
    
        ./load.sh -d
        ./load.sh -D
        
    respectivaly.
    
## Deploy the App:

    The app can be deployed either as a Kubernetes service or a Docker 
    Service. For Kubernetes instructions see:
    
        https://cloud.google.com/kubernetes-engine/docs/tutorials/hello-app
        
    To deploy with Docker, first install Docker and initialize a Docker swarm. 
    Start the app with
    
        docker service create --p 3000:3000 --name app-name app-image
        
    Use Apache2 to handle the SSL certs. Modify and copy ./site.conf to the apache2
    sites enabled folder.
