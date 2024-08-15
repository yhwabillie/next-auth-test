import { useEffect } from 'react'
import { useAddressStore } from '@/lib/stores/addressStore'

export const useAddressInfo = (userIdx: string) => {
  const {
    fetchData,
    defaultAddress,
    EtcAddress,
    handleOpenEditForm,
    handleSetDefaultAddress,
    showModal,
    handleRemoveAddress,
    setUserIdx,
    loading,
    isEmpty,
  } = useAddressStore()

  useEffect(() => {
    setUserIdx(userIdx)
    fetchData()
  }, [userIdx, setUserIdx, fetchData])

  return {
    defaultAddress,
    EtcAddress,
    handleOpenEditForm,
    handleSetDefaultAddress,
    showModal,
    handleRemoveAddress,
    loading,
    isEmpty,
  }
}
