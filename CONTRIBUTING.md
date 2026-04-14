# Contributing to saeroum-app

## 브랜치 전략

| 브랜치 | 용도 |
|---|---|
| `main` | 배포 기준 브랜치. 직접 push 금지 |
| `feature/*` | 새 기능 개발 (예: `feature/login-page`) |
| `fix/*` | 버그 수정 (예: `fix/nav-scroll`) |
| `chore/*` | 설정, 문서, 의존성 업데이트 |

## 작업 흐름

```bash
# 1. 최신 main 기준으로 브랜치 생성
git checkout main && git pull origin main
git checkout -b feature/your-feature-name

# 2. 작업 후 커밋
git add .
git commit -m "feat: 기능 설명"

# 3. 원격 저장소에 푸시
git push -u origin feature/your-feature-name

# 4. GitHub에서 PR 생성 → main으로 병합 요청
```

## 커밋 메시지 규칙 (Conventional Commits)

| prefix | 의미 |
|---|---|
| `feat:` | 새 기능 추가 |
| `fix:` | 버그 수정 |
| `chore:` | 설정, 빌드, 의존성 변경 |
| `docs:` | 문서 수정 |
| `style:` | 코드 포맷팅 (기능 변경 없음) |
| `refactor:` | 리팩토링 |
| `test:` | 테스트 추가/수정 |

## 로컬 개발 환경

```bash
npm install        # 의존성 설치
npm run dev        # 개발 서버 시작 (http://localhost:5173)
npm run build      # 프로덕션 빌드
npx tsc --noEmit   # TypeScript 타입 체크
```

## PR 규칙

- PR 제목은 커밋 메시지 규칙을 따릅니다
- main에 직접 push하지 않습니다
- CI(빌드/타입체크)가 통과해야 머지 가능합니다
- 스스로 PR 내용을 먼저 검토 후 리뷰를 요청합니다
