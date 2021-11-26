

# EditTrace
`@nrwl/nx`을 이용하여 생성된 프로젝트.

- api : 상품 정보를 검색하는 기능 및 크롤링되지 않은 상품정보는 람다를 호추랗여 업데이트하는 기능 
- lambda-crawler(추가 예정) : 상품 상세페이지를 크롤링하는 기능 
- cli : 상품 카탈로그 정보를 업데이트하는 기능

`nodejs` 버전 : `16.13.0`

- Api : `nestjs`
- Client : `flutter (예정)` 

### how to install
- `npm install -g @nrwl/nx`
- `npm install`

### how to run container
- `docker-compose up -d` (아직은 elasticsearch, redis 컨테이너만 사용)

### how to serve API
- `nx serve api`

### how to serve engine
- `npm run cli:build`
- `npm run cli -- <group_command> <execution_command>`


***
## Structure
각 어플리케이션에 대한 설명은 하단 링크를 통하면 볼 수 있습니다. 
```
+-- apps
    +-- api
    +-- cli
    +-- lambda
        +-- product-sync
+-- lib
    +-- config
    +-- engine   
    +-- models   
    +-- utils   
```

***
## Project Detail

- [api](apps/api/README.md)
- [cli](apps/cli/README.md)
- [lambda/product-sync](apps/lambda/product-sync/README.md)


