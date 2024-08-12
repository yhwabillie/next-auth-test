/**
 * 연락처 포맷팅
 * @param phoneNumber 전화번호 문자열
 * @returns 포맷된 전화번호 문자열 또는 원래 값
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return phoneNumber // 빈 값 또는 null/undefined 처리

  // 숫자만 추출
  const cleaned = phoneNumber.replace(/\D/g, '')

  // 한국 전화번호 패턴 (예: 010-1234-5678)
  const match = cleaned.match(/^(\d{2,3})(\d{3,4})(\d{4})$/)

  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`
  }

  return phoneNumber // 유효하지 않으면 원래 값 반환
}
