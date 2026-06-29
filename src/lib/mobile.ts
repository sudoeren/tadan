const PHONE_UA_PATTERN =
  /iPhone|iPod|webOS|BlackBerry|BB10|Windows Phone|IEMobile|Opera Mini|Opera Mobi|Mobile Safari|KaiOS|Kindle|Silk|Kindle Fire|Mobile|Tablet|Pixel|SamsungBrowser.*Mobile|MIUI\/.*Mobile|HMSCore.*Mobile/i

const TABLET_UA_PATTERN = /iPad|Android(?!.*Mobile)|PlayBook|Silk.*Tablet|Galaxy.*Tab/i

export function isMobileUserAgent(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false
  if (TABLET_UA_PATTERN.test(userAgent)) return false
  return PHONE_UA_PATTERN.test(userAgent)
}
