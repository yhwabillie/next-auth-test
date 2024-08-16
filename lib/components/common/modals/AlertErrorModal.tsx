interface AlertErrorModalProps {
  message: string
  handleClickClose: () => void
}

export const AlertErrorModal = ({ message, handleClickClose }: AlertErrorModalProps) => {
  return (
    <div className="fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-black/70 py-10">
      <section className="box-border h-auto w-[500px] flex-col justify-between rounded-2xl bg-white p-10 shadow-lg">
        <div>
          <h2 className="block text-center text-2xl font-semibold ">Error Message</h2>
          <p className="mb-8 mt-4 text-center leading-8" dangerouslySetInnerHTML={{ __html: message }} />
        </div>

        <button
          onClick={handleClickClose}
          className="leading-1 h-[50px] w-full min-w-full cursor-pointer rounded-md bg-red-400 py-3 text-white shadow-lg transition-all duration-150 ease-in-out hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          닫기
        </button>
      </section>
    </div>
  )
}
