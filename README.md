

# EditTrace
`@nrwl/nx`을 이용하여 생성된 프로젝트.

상품 정보를 저장하고 검색하는 기능을 가진 api

`nodejs` 버전 : `16.13.0`

- Api : `nestjs`
- Client : `flutter (예정)` 

### how to install
- `npm install -g @nrwl/nx`
- `npm install`

### how to run container
- `docker-compose up -d`

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
    
+-- lib
    +-- config
    +-- engine   
    +-- utils   
```

***
## Project Detail

- [api](apps/api/README.md)
- [cli](apps/cli/README.md)


