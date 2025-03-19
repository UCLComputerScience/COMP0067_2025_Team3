import Image from 'next/image'

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <Image src="/images/SpiderLogo.png" alt="Logo" width={50} height={50} />
    </div>
  )
}

export default Logo

