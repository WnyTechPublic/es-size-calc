# ES Sizing Calculator v0.1

Elasticsearch 저장량 산정을 위한 frontend-only v0.1 MVP입니다. 정적 Next.js + TypeScript 앱으로 동작하며, 계산 엔진과 Storage Profile은 `frontend/src/lib`의 순수 TypeScript 모듈과 상수로 구현되어 있습니다.

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

## Architecture

- App: static Next.js App Router under `frontend/src/app`
- UI components: `frontend/src/components`
- Calculation engine: `frontend/src/lib/sizingEngine.ts`
- Storage Profile presets: `frontend/src/lib/storageProfiles.ts`
- Input validation: `frontend/src/lib/validation.ts`
- Markdown export: `frontend/src/lib/markdown.ts`

v0.1 is entirely browser-side. It has no server runtime, database, or server-side Storage Profile filtering.

## GitHub Pages

The app is configured for GitHub Pages static export for `WnyTechPublic/es-size-calc` with:

- `basePath: /es-size-calc`
- `assetPrefix: /es-size-calc/`
- custom domain: `pub.wnytech.co.kr`

The Pages workflow builds `frontend/out` and deploys that artifact.
