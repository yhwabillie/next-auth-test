'use client'

export const MainPage = () => {
  return (
    <div className="py-10">
      <fieldset className="mb-5 flex flex-row justify-center">
        <input
          className="text-md box-border h-[50px] w-[400px] rounded-bl-md rounded-tl-md border border-gray-500/50 p-3 px-5 text-gray-500/40 shadow-md placeholder:text-gray-500/40 focus:outline-0"
          type="text"
          placeholder="제품을 검색해보세요"
          autoFocus
        />
        <label
          htmlFor="upload"
          className="text-md box-border h-[50px] w-[70px] cursor-pointer rounded-br-md rounded-tr-md border-gray-500/50 bg-blue-400 pt-[13px] text-center text-white shadow-md transition-all duration-150 ease-in-out hover:bg-blue-500"
        >
          검색
        </label>
        <input id="upload" type="file" accept=".xlsx, .xls" />
      </fieldset>
    </div>
  )
}
