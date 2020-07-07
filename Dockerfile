FROM node:11.10.1

# Create app directory
WORKDIR /home/russell/yeetwood/

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

#RUN npm install

# If you are building your code for production
RUN npm ci --only=production

# Bundle app source
COPY . .


# Build bundle.js
#RUN ./load.sh -j

EXPOSE 3000
#EXPOSE 8080

CMD [ "./load.sh", "-R" ]
