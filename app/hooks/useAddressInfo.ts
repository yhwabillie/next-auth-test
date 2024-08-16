import { useEffect } from 'react'
import { useAddressStore } from '@/lib/stores/addressStore'

export const useAddressInfo = (userIdx: string) => {
  const {
    fetchAddresses,
    defaultAddress,
    EtcAddress,
    openEditAddressForm,
    updateDefaultAddress,
    showModal,
    deleteAddress,
    setUserIdx,
    loading,
    isEmpty,
  } = useAddressStore()

  useEffect(() => {
    setUserIdx(userIdx)
    fetchAddresses()
  }, [userIdx, setUserIdx, fetchAddresses])

  return {
    defaultAddress,
    EtcAddress,
    openEditAddressForm,
    updateDefaultAddress,
    showModal,
    deleteAddress,
    loading,
    isEmpty,
  }
}
