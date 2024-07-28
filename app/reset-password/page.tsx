'use server'

export default async function Page() {
  return (
    <div>
      <h1>발급받은 토큰 페이지 입니다. 비밀번호를 재설정하세요</h1>
      <form>
        <fieldset>
          <label>신규 비밀번호</label>
          <input type="password" />
        </fieldset>
        <fieldset>
          <label>신규 비밀번호 확인</label>
          <input type="password" />
        </fieldset>
        <button>비밀번호 업데이트</button>
      </form>
    </div>
  )
}
