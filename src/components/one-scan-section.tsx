"use client"

import { Logo } from "@/components/logo"

export default function OneScanSection() {
  return (
    <section className="relative z-[2] py-16 sm:py-20">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.05] tracking-tight text-gray-900">
            One scan. Every platform.
          </h2>
          <p className="text-gray-500 text-base sm:text-lg mt-3 max-w-xl mx-auto leading-relaxed">
            Stop repeating yourself. Scan once with tadan, and we will
            check your copy against every platform policy in one pass.
          </p>

          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
            {/* Old way */}
            <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-8">
              <div className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-400">
                Old way
              </div>
              <svg
                width="320"
                height="200"
                viewBox="0 0 160 100"
                fill="none"
                className="text-gray-300"
              >
                <rect
                  x="4"
                  y="40"
                  width="32"
                  height="20"
                  rx="4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="white"
                />
                <text
                  x="20"
                  y="53"
                  textAnchor="middle"
                  className="fill-gray-400"
                  fontSize="8"
                >
                  You
                </text>

                <path
                  id="oldPath1"
                  d="M36 45 Q60 25 90 20"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="3 2"
                  fill="none"
                />
                <path
                  id="oldPath2"
                  d="M36 48 Q65 40 90 40"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="3 2"
                  fill="none"
                />
                <path
                  id="oldPath3"
                  d="M36 52 Q65 60 90 60"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="3 2"
                  fill="none"
                />
                <path
                  id="oldPath4"
                  d="M36 55 Q60 75 90 80"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="3 2"
                  fill="none"
                />

                <defs>
                  <g id="docIconGray">
                    <rect
                      x="-3"
                      y="-4"
                      width="6"
                      height="8"
                      rx="0.5"
                      fill="white"
                      stroke="#a1a1aa"
                      strokeWidth="0.5"
                    />
                    <path
                      d="M-1.5 -1.5 L1.5 -1.5 M-1.5 0.5 L1.5 0.5 M-1.5 2.5 L0.5 2.5"
                      stroke="#d4d4d8"
                      strokeWidth="0.5"
                    />
                  </g>
                  <g id="metaLogo">
                    <path
                      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                      fill="#1877F2"
                    />
                  </g>
                  <g id="googleLogo">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </g>
                  <g id="taboolaLogo">
                    <rect width="24" height="24" rx="5" fill="#1E5BD9" />
                    <ellipse cx="8.5" cy="9" rx="2.4" ry="3" fill="white" />
                    <ellipse cx="15.5" cy="9" rx="2.4" ry="3" fill="white" />
                    <path
                      d="M 5.5 14 Q 12 20 18.5 14 L 18.5 16 Q 12 22 5.5 16 Z"
                      fill="white"
                    />
                  </g>
                  <g id="tiktokLogo">
                    <g transform="translate(-1.5 0)">
                      <path
                        d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.892 2.892 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.932 2.932 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.65a8.16 8.16 0 0 0 4.77 1.52V6.78a4.85 4.85 0 0 1-1.84-.09Z"
                        fill="#25F4EE"
                      />
                    </g>
                    <g transform="translate(1.5 0)">
                      <path
                        d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.892 2.892 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.932 2.932 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.65a8.16 8.16 0 0 0 4.77 1.52V6.78a4.85 4.85 0 0 1-1.84-.09Z"
                        fill="#FE2C55"
                      />
                    </g>
                    <path
                      d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.892 2.892 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.932 2.932 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.65a8.16 8.16 0 0 0 4.77 1.52V6.78a4.85 4.85 0 0 1-1.84-.09Z"
                      fill="#000"
                    />
                  </g>
                </defs>
                <use href="#docIconGray" opacity="0">
                  <animateMotion
                    id="oldDot1Motion"
                    dur="3s"
                    begin="0s; oldDot4Motion.end + 1.5s"
                  >
                    <mpath href="#oldPath1" />
                  </animateMotion>
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    keyTimes="0;0.01;0.95;1"
                    dur="3s"
                    begin="0s; oldDot4Motion.end + 1.5s"
                  />
                </use>
                <use href="#docIconGray" opacity="0">
                  <animateMotion
                    id="oldDot2Motion"
                    dur="3s"
                    begin="oldDot1Motion.begin + 2.5s"
                  >
                    <mpath href="#oldPath2" />
                  </animateMotion>
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    keyTimes="0;0.01;0.95;1"
                    dur="3s"
                    begin="oldDot1Motion.begin + 2.5s"
                  />
                </use>
                <use href="#docIconGray" opacity="0">
                  <animateMotion
                    id="oldDot3Motion"
                    dur="3s"
                    begin="oldDot1Motion.begin + 5s"
                  >
                    <mpath href="#oldPath3" />
                  </animateMotion>
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    keyTimes="0;0.01;0.95;1"
                    dur="3s"
                    begin="oldDot1Motion.begin + 5s"
                  />
                </use>
                <use href="#docIconGray" opacity="0">
                  <animateMotion
                    id="oldDot4Motion"
                    dur="3s"
                    begin="oldDot1Motion.begin + 7.5s"
                  >
                    <mpath href="#oldPath4" />
                  </animateMotion>
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    keyTimes="0;0.01;0.95;1"
                    dur="3s"
                    begin="oldDot1Motion.begin + 7.5s"
                  />
                </use>

                <rect
                  x="90"
                  y="12"
                  width="24"
                  height="16"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="white"
                />
                <rect
                  x="90"
                  y="32"
                  width="24"
                  height="16"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="white"
                />
                <rect
                  x="90"
                  y="52"
                  width="24"
                  height="16"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="white"
                />
                <rect
                  x="90"
                  y="72"
                  width="24"
                  height="16"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="white"
                />

                <use
                  href="#metaLogo"
                  transform="translate(102 20) scale(0.6) translate(-12 -12)"
                />
                <use
                  href="#googleLogo"
                  transform="translate(102 40) scale(0.6) translate(-12 -12)"
                />
                <use
                  href="#taboolaLogo"
                  transform="translate(102 60) scale(0.6) translate(-12 -12)"
                />
                <use
                  href="#tiktokLogo"
                  transform="translate(102 80) scale(0.6) translate(-12 -12)"
                />

                <text
                  x="125"
                  y="24"
                  className="fill-gray-300"
                  fontSize="10"
                >
                  ✕
                </text>
                <text
                  x="125"
                  y="44"
                  className="fill-gray-300"
                  fontSize="10"
                >
                  ?
                </text>
                <text
                  x="125"
                  y="64"
                  className="fill-gray-300"
                  fontSize="10"
                >
                  ✕
                </text>
                <text
                  x="125"
                  y="84"
                  className="fill-gray-300"
                  fontSize="10"
                >
                  ?
                </text>
              </svg>
            </div>

            <div className="text-xl font-semibold text-gray-900">vs.</div>

            {/* With tadan */}
            <div
              style={{ borderColor: "#f97316" }}
              className="relative flex flex-col items-center rounded-xl border bg-white p-8"
            >
              <div className="mb-3 text-xs font-medium uppercase tracking-wide text-orange-500">
                With tadan
              </div>
              <div className="relative">
                <svg
                  width="320"
                  height="200"
                  viewBox="0 0 160 100"
                  fill="none"
                >
                  <rect
                    x="4"
                    y="40"
                    width="32"
                    height="20"
                    rx="4"
                    stroke="#f97316"
                    strokeWidth="1.5"
                    fill="white"
                  />
                  <text
                    x="20"
                    y="53"
                    textAnchor="middle"
                    className="fill-orange-500"
                    fontSize="8"
                  >
                    You
                  </text>

                  <path
                    id="pathToTadan"
                    d="M36 50 L58 50"
                    stroke="#f97316"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    id="pathToCompany1"
                    d="M70 50 Q90 25 108 20"
                    stroke="#f97316"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <path
                    id="pathToCompany2"
                    d="M70 50 Q95 40 108 40"
                    stroke="#f97316"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <path
                    id="pathToCompany3"
                    d="M70 50 Q95 60 108 60"
                    stroke="#f97316"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <path
                    id="pathToCompany4"
                    d="M70 50 Q90 75 108 80"
                    stroke="#f97316"
                    strokeWidth="1.5"
                    fill="none"
                  />

                  <defs>
                    <g id="docIconOrange">
                      <rect
                        x="-3"
                        y="-4"
                        width="6"
                        height="8"
                        rx="0.5"
                        fill="white"
                        stroke="#f97316"
                        strokeWidth="0.5"
                      />
                      <path
                        d="M-1.5 -1.5 L1.5 -1.5 M-1.5 0.5 L1.5 0.5 M-1.5 2.5 L0.5 2.5"
                        stroke="#fdba74"
                        strokeWidth="0.5"
                      />
                    </g>
                    <g id="metaLogoR">
                      <path
                        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                        fill="#1877F2"
                      />
                    </g>
                    <g id="googleLogoR">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </g>
                    <g id="taboolaLogoR">
                      <rect width="24" height="24" rx="5" fill="#1E5BD9" />
                      <ellipse cx="8.5" cy="9" rx="2.4" ry="3" fill="white" />
                      <ellipse cx="15.5" cy="9" rx="2.4" ry="3" fill="white" />
                      <path
                        d="M 5.5 14 Q 12 20 18.5 14 L 18.5 16 Q 12 22 5.5 16 Z"
                        fill="white"
                      />
                    </g>
                    <g id="tiktokLogoR">
                      <g transform="translate(-1.5 0)">
                        <path
                          d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.892 2.892 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.932 2.932 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.65a8.16 8.16 0 0 0 4.77 1.52V6.78a4.85 4.85 0 0 1-1.84-.09Z"
                          fill="#25F4EE"
                        />
                      </g>
                      <g transform="translate(1.5 0)">
                        <path
                          d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.892 2.892 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.932 2.932 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.65a8.16 8.16 0 0 0 4.77 1.52V6.78a4.85 4.85 0 0 1-1.84-.09Z"
                          fill="#FE2C55"
                        />
                      </g>
                      <path
                        d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.892 2.892 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.932 2.932 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.65a8.16 8.16 0 0 0 4.77 1.52V6.78a4.85 4.85 0 0 1-1.84-.09Z"
                        fill="#000"
                      />
                    </g>
                  </defs>
                  <use href="#docIconOrange" opacity="0">
                    <animateMotion
                      id="dotToTadan"
                      dur="1.5s"
                      begin="0s; dotToCompany1.end + 0.5s"
                    >
                      <mpath href="#pathToTadan" />
                    </animateMotion>
                    <animate
                      attributeName="opacity"
                      values="0;1;1;0"
                      keyTimes="0;0.02;0.95;1"
                      dur="1.5s"
                      begin="0s; dotToCompany1.end + 0.5s"
                      fill="freeze"
                    />
                  </use>
                  <use href="#docIconOrange" opacity="0">
                    <animateMotion
                      id="dotToCompany1"
                      dur="3s"
                      begin="dotToTadan.end"
                    >
                      <mpath href="#pathToCompany1" />
                    </animateMotion>
                    <animate
                      attributeName="opacity"
                      values="0;1;1;0"
                      keyTimes="0;0.01;0.95;1"
                      dur="3s"
                      begin="dotToTadan.end"
                      fill="freeze"
                    />
                  </use>
                  <use href="#docIconOrange" opacity="0">
                    <animateMotion
                      dur="3s"
                      begin="dotToTadan.end"
                    >
                      <mpath href="#pathToCompany2" />
                    </animateMotion>
                    <animate
                      attributeName="opacity"
                      values="0;1;1;0"
                      keyTimes="0;0.01;0.95;1"
                      dur="3s"
                      begin="dotToTadan.end"
                      fill="freeze"
                    />
                  </use>
                  <use href="#docIconOrange" opacity="0">
                    <animateMotion
                      dur="3s"
                      begin="dotToTadan.end"
                    >
                      <mpath href="#pathToCompany3" />
                    </animateMotion>
                    <animate
                      attributeName="opacity"
                      values="0;1;1;0"
                      keyTimes="0;0.01;0.95;1"
                      dur="3s"
                      begin="dotToTadan.end"
                      fill="freeze"
                    />
                  </use>
                  <use href="#docIconOrange" opacity="0">
                    <animateMotion
                      dur="3s"
                      begin="dotToTadan.end"
                    >
                      <mpath href="#pathToCompany4" />
                    </animateMotion>
                    <animate
                      attributeName="opacity"
                      values="0;1;1;0"
                      keyTimes="0;0.01;0.95;1"
                      dur="3s"
                      begin="dotToTadan.end"
                      fill="freeze"
                    />
                  </use>

                  <circle
                    cx="70"
                    cy="50"
                    r="12"
                    fill="#fff7ed"
                    stroke="#f97316"
                    strokeWidth="1.5"
                  />

                  <rect
                    x="108"
                    y="12"
                    width="24"
                    height="16"
                    rx="2"
                    stroke="#f97316"
                    strokeWidth="1"
                    fill="white"
                  />
                  <rect
                    x="108"
                    y="32"
                    width="24"
                    height="16"
                    rx="2"
                    stroke="#f97316"
                    strokeWidth="1"
                    fill="white"
                  />
                  <rect
                    x="108"
                    y="52"
                    width="24"
                    height="16"
                    rx="2"
                    stroke="#f97316"
                    strokeWidth="1"
                    fill="white"
                  />
                  <rect
                    x="108"
                    y="72"
                    width="24"
                    height="16"
                    rx="2"
                    stroke="#f97316"
                    strokeWidth="1"
                    fill="white"
                  />

                  <use
                    href="#metaLogoR"
                    transform="translate(120 20) scale(0.6) translate(-12 -12)"
                  />
                  <use
                    href="#googleLogoR"
                    transform="translate(120 40) scale(0.6) translate(-12 -12)"
                  />
                  <use
                    href="#taboolaLogoR"
                    transform="translate(120 60) scale(0.6) translate(-12 -12)"
                  />
                  <use
                    href="#tiktokLogoR"
                    transform="translate(120 80) scale(0.6) translate(-12 -12)"
                  />

                  <text
                    x="143"
                    y="24"
                    className="fill-orange-500"
                    fontSize="10"
                  >
                    ✓
                  </text>
                  <text
                    x="143"
                    y="44"
                    className="fill-orange-500"
                    fontSize="10"
                  >
                    ✓
                  </text>
                  <text
                    x="143"
                    y="64"
                    className="fill-orange-500"
                    fontSize="10"
                  >
                    ✓
                  </text>
                  <text
                    x="143"
                    y="84"
                    className="fill-orange-500"
                    fontSize="10"
                  >
                    ✓
                  </text>
                </svg>
                <Logo className="absolute left-[140px] top-[100px] -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-orange-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
