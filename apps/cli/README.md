# CLI

## 구조도
`nx dep-graph` 명령어를 통해 확인 가능.

## 엔진 실행 방법
- `npm run cli:build`
- `npm run cli -- <group_command> <execution_command>` 포맷에 맞춰 명렁어 사용. ex) `npm run cli -- es create-index TEST-INDEX`

```
engine
- run <shopCode> -url <targetUrl> : 샵 유형을 지정한 후, url을 값을 넣어주면 해당 샵의 페이지를 크롤링해오는 cli
- update-catalog : ES에 당일 카탈로그 정보를 저장. 평균 130만건

elasticsearch
- create-index : ES에 인덱스를 생성하는 명렁어
- re-index <target> <result>: 리인덱스 명령어
```

