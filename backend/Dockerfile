###
## Production
###
FROM node:16-slim as production

ENV NODE_ENV production
# Add a work directory
WORKDIR /app
# Cache and Install dependencies
COPY package.json .
# Install
RUN yarn install --only=production

# Add files
COPY *.js /app/
COPY index.html /app/



# $PORT is set by Heroku			
ENV PORT=$PORT
CMD [ "node", "main.js" ]