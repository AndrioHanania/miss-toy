import { useEffect, useRef } from 'react'
export function useEffectUpdate(cb, dep) {

    const isFirstRender = useRef(true)

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        cb()
    }, dep)
}