"use client"

import StepsSection from "@/components/steps-section"
import InputModesSection from "@/components/input-modes-section"
import OneScanSection from "@/components/one-scan-section"
import WhyTadanSection from "@/components/why-tadan-section"
import { Faq } from "@/components/faq"

export default function HowItWorksContent() {
  return (
    <div id="how-it-works" className="relative bg-white">
      <StepsSection />
      <InputModesSection />
      <OneScanSection />
      <WhyTadanSection />

      <section className="relative z-[2] py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.05] tracking-tight text-gray-900">
              Common questions
            </h2>
          </div>
          <Faq />
        </div>
      </section>
    </div>
  )
}
