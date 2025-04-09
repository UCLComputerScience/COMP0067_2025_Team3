'use client'

import Image from 'next/image'

import { useSettings } from '../hooks/useSettings'

const Logo = ({ className }: { className?: string }) => {
  const { settings } = useSettings()

  return (
    <div className={className}>
      <Image
        src={settings.mode === 'dark' ? '/images/logos/spider-logo-dark.png' : '/images/logos/spider-logo-light.png'}
        alt='Spider Logo'
        objectFit='cover'
        width={200}
        height={50}
      />
    </div>
  )
}

export default Logo


