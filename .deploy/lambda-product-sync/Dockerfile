# multi-stage-build
FROM public.ecr.aws/lambda/nodejs:14 as build
WORKDIR /usr/src/app
RUN npm install -g nx
COPY package*.json ./
RUN npm ci --only=prod
COPY . .
RUN nx build lambda-product-sync --prod


FROM public.ecr.aws/lambda/nodejs:14 as target
ENV TZ=Asia/Seoul
COPY --from=build /usr/src/app/dist/apps/lambda/product-sync ${LAMBDA_TASK_ROOT}
RUN npm i
CMD [ "main.handler" ]
