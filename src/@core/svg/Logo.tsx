'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSettings } from '../hooks/useSettings'

const Logo = ({ className }: { className?: string }) => {
  const { settings } = useSettings()

  return (
    <div className={className}>
      <Link href="/" className="flex items-center space-x-2">
        <Image
          src={settings.mode === 'dark'
            ? '/images/logos/spider-logo-dark.png'
            : '/images/logos/spider-logo-light.png'}
          alt="Spider Logo"
          width={200}
          height={50}
          style={{ objectFit: 'cover' }}
        />
      </Link>
    </div>
  )
}

export default Logo
