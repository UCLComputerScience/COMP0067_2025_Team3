'use client'

// Next Imports
import Link from 'next/link'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
import useHorizontalNav from '@menu/hooks/useHorizontalNav'

// Util Imports
import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'

const FooterContent = () => {
  // Hooks
  const { isBreakpointReached } = useHorizontalNav()

  return (
    <div
      style={{ background: '#433C50' }}
      className={classnames(horizontalLayoutClasses.footerContent, 'flex items-center justify-between flex-wrap gap-4')}
    >
      <p>
        <span>{`© ${new Date().getFullYear()}, Made with `}</span>
        <span>{`❤️`}</span>
        <span>{` by `}</span>
        <Link href='https://mui.com/store/contributors/themeselection' target='_blank' className='text-primary'>
          ThemeSelection
        </Link>
      </p>
      {!isBreakpointReached && (
        <div className='flex items-center gap-4'>
          <Link href='https://mui.com/store/license' target='_blank' className='text-primary'>
            About
          </Link>
          <Link href='https://mui.com/store/contributors/themeselection' target='_blank' className='text-primary'>
            Team
          </Link>
          <Link
            href='https://demos.themeselection.com/marketplace/materio-mui-nextjs-admin-template/documentation'
            target='_blank'
            className='text-primary'
          >
            Resources
          </Link>
        </div>
      )}
    </div>
  )
}

export default FooterContent
