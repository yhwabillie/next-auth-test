# Title: next-auth-test

### NextAuth.js 을 이용한 로그인 구현
- 자체 ID, PW를 이용한 credential provider 사용
- NextAuth.js에서 제공하는 JWT 사용

### Vercel 배포, PNPM 빌드, Supabase 백엔드
- vercel이 아직 yarn berry를 지원하지 않아 package manager PNPM v9 으로 변경
- 프론트 배포 Vercel, 백엔드 Supabase 사용

### API Routes
- [POST] Auth(인증/인가)
    - /api/signIn
    - /api/auth/[...nextauth]

- [POST] 회원가입
    - /api/signUp

- [GET] 사용자 프로필 data fetch
    - /api/profile

### Server Actions
- DB Mutation에 사용 
    - [Update DB] updateUserName
        - profile 화면 > 사용자 이름 변경

### Form Validation
- Form 유효성 검사 라이브러리 사용
    - react-hook-form
    - zodResolver
