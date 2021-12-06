FROM public.ecr.aws/lambda/nodejs:14
COPY *.js package*.json ./
RUN npm install
CMD [ "app.handler" ]
