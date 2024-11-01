import { useState, useEffect } from 'react'

interface TimeProps {
    format: '12h' | '24h';
}

export default function Time({ format }: TimeProps) {
    const [time, setTime] = useState(new Date())

    let hours = format === '12h' && time.getHours() > 12 ? time.getHours() - 12 : time.getHours()
    let minutes = time.getMinutes().toString().padStart(2, '0')
    let appendix = format === '12h' && time.getHours() >= 12 ? 'PM' : 'AM'

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date())
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    return (
        <p>
            {hours}:{minutes} {appendix}
        </p>
    )
}
