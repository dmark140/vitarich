// 'use client'

// import React, { useEffect, useState } from 'react'
// import { useGlobalContext } from './context/GlobalContext'

// export default function GlobalLoading() {
//     const transitionSpeed = 500 // fade transition speed (ms)
//     const visibleDelay = 500    // stay visible before fade out (ms)

//     const [step, setStep] = useState(0)
//     const { setValue, getValue } = useGlobalContext()
//     const [isVisible, setIsVisible] = useState(false)
//     const [globalLoading, setGlobalLoading] = useState(false)
//     const [lines, setLines] = useState<string[]>(['---------', '---------', '---------'])

//     const randomChar = () => {
//         const chars = '!@#$%^&*()_+=abcdefghijklmnopqrstuvwxyz0123456789'
//         return chars[Math.floor(Math.random() * chars.length)]
//     }

//     const generateLine = (length: number, currentStep: number) => {
//         const totalSteps = length + 3
//         const index = currentStep % totalSteps

//         let visibleCount = 3
//         if (index === 0) visibleCount = 1
//         else if (index === 1) visibleCount = 2
//         else if (index < 2) visibleCount = 3

//         let result = ''
//         for (let i = 0; i < length; i++) {
//             if (i >= index - visibleCount + 1 && i <= index) result += randomChar()
//             else result += '-'
//         }
//         return result
//     }

//     useEffect(() => {
//         if (!isVisible) return

//         const interval = setInterval(() => {
//             setStep((prev) => {
//                 const nextStep = prev + 1
//                 setLines([
//                     generateLine(9, nextStep),
//                     generateLine(9, nextStep + 2),
//                     generateLine(9, nextStep + 4),
//                 ])
//                 return nextStep
//             })
//         }, 300)

//         return () => clearInterval(interval)
//     }, [isVisible])

//     useEffect(() => {
//         const newGlobalLoading = getValue('loading_g') || false
//         setGlobalLoading(newGlobalLoading)

//         let timeoutId: NodeJS.Timeout

//         if (newGlobalLoading) {
//             // Show loader immediately
//             setIsVisible(true)
//         } else {
//             // Wait before hiding loader
//             timeoutId = setTimeout(() => {
//                 setIsVisible(false)
//             }, visibleDelay + transitionSpeed)
//         }

//         return () => clearTimeout(timeoutId)
//     }, [getValue('loading_g'), transitionSpeed])

//     if (!isVisible) return null

//     const durationClass = `duration-${transitionSpeed}`

//     return (
//         <div
//             className={`
//         flex flex-col items-center justify-center h-screen text-foreground font-mono tracking-widest 
//         fixed z-999 bg-background w-screen transition-opacity ease-in-out ${durationClass} 
//         ${globalLoading ? 'opacity-100' : 'opacity-0'}
//       `}
//         >
//             {lines.map((line, i) => (
//                 <div key={i}>
//                     {i === 0 && line}
//                     {i === 1 && '--VITA--'}
//                     {i === 2 && line}
//                 </div>
//             ))}
//         </div>
//     )
// }


export default function Loading() {
  return (
    <div className="loader-container">
      <div className="loader-bar" />
    </div>
  )
}