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
    - zod 스키마를 이용하여 인풋데이터 유효성 검사 작업 (+regex)
      <br/> <br/>
- submit 결과 및 에러 노티스
  - Sonner 토스트 메시지 사용 (Notification Library)

### 로그인 로직 (signIn)

#### 1) 프론트 Form

- zod 스키마 유효성 검사를 통과한 ID,PW 인풋데이터 submit
- NextAuth Client API SignIn 메소드를 사용하여 데이터 전송
- 서버로 데이터 전송이 시작되면 loading state를 이용하여 form을 가려 추가적인 화면단 에러 방지

#### 2) 백엔드 API Routes (/api/auth/[...nextauth])

- SignIn 메소드를 통해 authorize 함수로 signIn API POST 요청
- `/api/signIn` API로 데이터 전달

#### 3) 백엔드 API Routes (/api/signIn)

- 받은 ID를 DB에서 검색하여 `일치하는 ID가 있는지 확인 및 예외처리, error 핸들링`
- 검색 결과가 없는 경우 throw error로 에러를 일으켜서 `auth.ts`에서 `try~catch`로 `에러를 감지`할 수 있도록 함
- 일치하는 ID와 PW가 있을 경우 해당 사용자의 user DB 데이터를 user 객체로 auth.ts에 다시 return

#### 4) 백엔드 API Routes (/api/auth/[...nextauth])

- 일치하는 DB 정보가 있는 경우, 사용자 DB 데이터를 받아 Return (user 객체) -> authOptions의 `callback에서 user로 token 데이터를 만드는데 사용`
- user 객체로 JWT token 데이터를 만든 후 return
- session 데이터에 user 정보가 담긴 token을 추가
- 사용자 정보를 token으로 가지고 있는 session return, 로그인 완료

<br/>

- 일치하는 정보가 없는 경우, signIn API에서 일으킨 에러를 try~catch문의 error로 잡음
- error 메시지에 `ID 혹은 비밀번호가 맞지 않습니다.` 를 작성하여 프론트로 다시 전달
- 빈 객체로 session이 return, 로그인 실패

#### 5) 프론트 Form

- sonner 라이브러를 사용해서 toast 컴포넌트로 loading, success, error 케이스별로 사용자에게 상황을 전달
- signIn 메소드의 response 상태가 Ok면, 로그인 성공 메시지 전달
- signIn 메소드의 response 상태가 Ok가 아니면, auth.ts에서 전송한 error 메시지를 반환하여 사용자에게 보여줌
- 모든 과정이 종료되면 loading state를 false 변환하여 form 컴포넌트 로딩화면 종료 및 메인페이지 이동
