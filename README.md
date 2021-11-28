

# EditTrace
### 개요
`@nrwl/nx`을 이용하여 생성된 프로젝트.

기존에 만들었던 HIED 프로젝트에 구조적인 아쉬움을 느껴 만들어보는 개인 프로젝트.

### apps
- api : 상품 정보를 검색하는 기능 및 크롤링되지 않은 상품정보는 람다를 호추랗여 업데이트하는 기능 
- cli : 상품 카탈로그 정보를 업데이트하는 기능
- lambda-product-sync : 상품 상세페이지를 크롤링하는 람다 함수 (컨테이너 이미지)


### requirements
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


***

## 개선내역

### 기존 수집 프로세스
1. 쇼핑몰별 상품 수집
2. 상품 마이그레이션
3. ElasticSearch 마이그레이션

### 변경된 수집 프로세스
1. 상품 카탈로그 수집(제휴 마케팅 플랫폼 제공)
   1. 상품 크롤링 (상품 접근시 트리거)
   2. REDIS 에 저장
   3. 추후에 다시 상품 점근시 REDIS에서 상품 정보 조회
   
### 비교
|-|기존 구조|변경된 구조 |
|---|---|---|
|저장소|Mysql, Elasticsearch|Elasticsearch, Redis|
|수집 속도(100~130만건 기준)|12~14h|5m~7m|
|모든 상품 수집|O|O|
|상품 정보 저장|O|△ (REDIS에 당일자 상품만 저장)|
|상품 정보 히스토리 추적|X|O|

