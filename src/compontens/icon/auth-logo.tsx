import Image from 'next/image'
import React from 'react'

export default function AuthLogo() {
    return (
        <div>
            <Image src="/image/auth-logo.png" alt="Auth Logo" width={100} height={100} />
        </div>
    )
}
