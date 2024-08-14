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

/**
 * 원래 가격과 할인율을 사용하여 할인된 가격을 계산하는 함수.
 *
 * 이 함수는 주어진 원래 가격(`originalPrice`)과 할인율(`discountRate`)을 기반으로 할인된 가격을 계산하고,
 * 이를 한국 원화 형식으로 반환합니다. 할인율은 0과 1 사이의 값이어야 하며, 원래 가격은 0 이상이어야 합니다.
 *
 * @param {number} [originalPrice=0] - 할인 전의 원래 가격. 기본값은 0입니다.
 * @param {number} discountRate - 할인율 (0과 1 사이의 값). 1은 100% 할인, 0은 할인 없음.
 * @param {number} quantity - 개수.
 * @returns {string} - 할인된 가격을 반올림하여 한국 원화 형식으로 문자열로 반환합니다.
 * @throws {Error}
 */
export const calculateDiscountedPrice = (originalPrice = 0, discountRate = 0, quantity = 1): string => {
  // 할인율의 범위 검사 (0 ~ 1)
  if (discountRate < 0 || discountRate > 1) {
    throw new Error('Invalid discount rate. It must be between 0 and 1.')
  }

  // 가격 유효성 검사
  if (originalPrice < 0) {
    throw new Error('Original price cannot be negative.')
  }

  const discountedPrice = originalPrice - originalPrice * discountRate
  return `${Math.round(discountedPrice * quantity).toLocaleString('ko-KR')}원`
}
