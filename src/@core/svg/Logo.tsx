import Image from 'next/image'
import SpiderLogo from '@components/layout/horizontal/spider_logo_1.png'

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
       <Image src={SpiderLogo} alt='Spider Logo' objectFit='cover' width={200} height={50} />

    </div>
  )
}

export default Logo

