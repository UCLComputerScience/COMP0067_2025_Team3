import Link from 'next/link'
import Image from 'next/image'

import SpiderLogo from '@components/layout/horizontal/spider_logo_1.png'

const Logo = ({ className }: { className?: string }) => {
  return (
    <Link href="/" passHref>
      <Image src={SpiderLogo} alt="Spider Logo" width={200} height={50} className={className} />
    </Link>
  )
}

export default Logo
