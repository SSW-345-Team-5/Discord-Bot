FROM nikolaik/python-nodejs

# Create app directory
WORKDIR /usr/src/app/discordbot

COPY requirements.txt ./

# Install requirements
RUN pip install -r requirements.txt

# add `usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/discordbot/node_modules/.bin:$PATH

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .


EXPOSE 80
CMD npm start