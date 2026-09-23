# 전국축제달력

대한민국 전국 축제를 날짜·지역·목적·지도로 빠르게 발견하고 비교하는 정적 웹서비스입니다. 종합 여행 사이트보다 “이번 주말 어디 갈까?”에 빠르게 답하는 데 집중합니다.

## 주요 기능

- 오늘, 이번/다음 주말, 진행 중, 종료 임박, 무료, 야간 필터
- 검색 자동완성, 복합 필터, 정렬, URL 검색 상태 공유
- Leaflet 기반 지도, 마커 클러스터, 현재 위치, 모바일 지도 미리보기
- 달력, 조건 점수 기반 맞춤 추천과 추천 이유
- 상세 5초 요약, 상세 URL, 지도, 관련 축제, 공유
- localStorage 기반 찜·최근 본 축제·저장 필터
- Light/Dark/System 테마, 반응형 UI, 접근성 모달
- 동적 메타데이터와 Event JSON-LD
- 기본 비활성화된 수익화 확장 구조

## Architecture

빌드 과정 없이 GitHub Pages에서 실행됩니다.

```text
index.html
app.css
app.js
data.js
storage.js
theme.js
analytics.js
festivals.json
manifest.json
generate-static-pages.mjs
update-festivals.yml.disabled
```

## Festival Schema

필수 필드는 `id`, `title`, `startDate`, `endDate`입니다. 날짜는 `YYYY-MM-DD` 형식입니다.

```json
{
  "id": "",
  "slug": "",
  "title": "",
  "description": "",
  "region": "",
  "city": "",
  "address": "",
  "venue": "",
  "latitude": null,
  "longitude": null,
  "startDate": "",
  "endDate": "",
  "category": "",
  "tags": [],
  "free": null,
  "price": null,
  "night": null,
  "parking": null,
  "phone": null,
  "image": null,
  "source": null,
  "sourceUrl": null,
  "updatedAt": null
}
```

잘못된 필수 데이터는 경고 후 제외합니다. 좌표가 없으면 목록에는 유지하되 지도에서만 제외합니다. 알 수 없는 가격·주차·운영정보는 임의 생성하지 않습니다.

## Local Development

루트에서 정적 서버를 실행합니다. `file://`로 열면 JSON `fetch()`가 차단될 수 있습니다.

```bash
python -m http.server 8765
```

그 후 `http://127.0.0.1:8765/`을 엽니다.

## GitHub Pages Deployment

저장소 `main` 브랜치 루트를 Pages 소스로 사용합니다. 모든 내부 자산은 `./` 상대경로를 사용해 repository subpath 배포를 지원합니다.

## Public Data Update Architecture

목표 흐름은 다음과 같습니다.

```text
Scheduled GitHub Action
  → TourAPIAdapter / LocalFestivalAdapter
  → normalizeFestival() + validateFestival()
  → festivals.json
  → 변경 시에만 commit
  → GitHub Pages 배포
```

`update-festivals.yml.disabled`는 설계 템플릿이며 실제 API 키와 updater가 준비될 때 `.yml`로 활성화합니다. API 키는 저장소에 넣지 않고 `TOUR_API_KEY` GitHub Actions Secret으로만 전달합니다.

## SEO

현재 상세 화면은 `?festival=slug` 클라이언트 모달이므로 JavaScript 메타 변경만으로 검색엔진 색인이 완전히 보장되지는 않습니다. `generate-static-pages.mjs`는 향후 `/festival/{slug}/` 정적 문서 생성으로 전환하기 위한 기반입니다.

## Environment / Secrets

- 현재 실행에 필요한 환경 변수 없음
- 향후 공공 API: `TOUR_API_KEY` GitHub Actions Secret
- 오류 제보 URL과 광고 문의 endpoint는 실제 값이 있을 때만 활성화

## Monetization Architecture

Sponsored Festival, Local Ad, Affiliate, Radar Plus 플래그는 기본 `false`입니다. 실제 광고 데이터와 유효한 URL이 없으면 UI에 노출되지 않습니다. 광고 클릭 이벤트 구조만 준비되어 있습니다.

## Roadmap

1. 공공 API updater와 데이터 품질 검사
2. 정적 축제 상세 페이지 생성 및 sitemap
3. 실제 오류 제보·광고 문의 endpoint
4. PWA 아이콘 및 오프라인 데이터 정책 확정 후 installability 완성
5. GA4 연결과 전환 Funnel 분석
