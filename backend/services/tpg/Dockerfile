# use the official Node.js  LTS image
FROM node:lts-alpine

# set the working directory inside the container
WORKDIR /code

# copy package.json and package-lock.json to the working directory
COPY package.json /code/package.json
COPY package-lock.json /code/package-lock.json

# install dependencies
RUN npm install

# copy the rest of the application code
COPY . /code

# expose port 3000 (or whichever port your application uses)
EXPOSE 3000

# command to run the application
CMD ["node", "app.js"]
