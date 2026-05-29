# Elastic Size Calculator v0.1

Elastic Size Calculator는 Elasticsearch 저장 용량을 빠르게 산정하기 위한 frontend-only 계산기입니다.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Checks:

```bash
cd frontend
npm test
npm run lint
npm run build
```

## 계산식

입력값:

- 일일 원본 수집량(GB/day)
- ES 저장 비율
- 보관일수
- Replica 수
- 운영 여유율
- 노드당 유효 저장량(GB)

결과값:

- 일일 ES Primary = 일일 원본 수집량 × ES 저장 비율
- 보관 기간 Primary = 일일 ES Primary × 보관일수
- Replica 포함 = 보관 기간 Primary × (1 + Replica 수)
- 여유율 포함 = Replica 포함 × (1 + 운영 여유율)
- 필요 data node = ROUNDUP(여유율 포함 ÷ 노드당 유효 저장량)

## Architecture

- App: static Next.js App Router under `frontend/src/app`
- UI components: `frontend/src/components`
- Calculation engine: `frontend/src/lib/sizingEngine.ts`
- Input validation: `frontend/src/lib/validation.ts`
- Markdown export: `frontend/src/lib/markdown.ts`

v0.1 is entirely browser-side. It has no server runtime, database, or server-side filtering.

## GitHub Pages

The app is configured for GitHub Pages static export for `WnyTechPublic/es-size-calc` with:

- `basePath: /es-size-calc`
- `assetPrefix: /es-size-calc/`
- custom domain: `pub.wnytech.co.kr`

The Pages workflow builds `frontend/out` and deploys that artifact.
