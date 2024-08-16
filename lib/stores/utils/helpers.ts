import { toast } from 'sonner'

export const handleLoading = async (
  setLoading: (loading: boolean) => void,
  callback: () => Promise<void>,
  errorMessage: string = '오류가 발생했습니다.',
  successMessage?: string, // 성공 메시지를 선택적으로 전달
) => {
  setLoading(true)
  try {
    await callback()

    if (successMessage) {
      toast.success(successMessage) // 성공 메시지가 있을 때만 출력
    }
  } catch (error: any) {
    console.error('오류:', error)
    toast.error(error.message || errorMessage)
  } finally {
    setLoading(false)
  }
}
