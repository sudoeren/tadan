const BG_URL =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260611_133301_d5f2a94a-b22e-4e4a-a6b6-eacdddf1f5b0.png&w=1920&q=85"

export function BackgroundLayer() {
  return (
    <>
      <div
        aria-hidden
        className="fixed inset-0 bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: `url(${BG_URL})`,
        }}
      />
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none hero-overlay"
      />
    </>
  )
}
