// MUI Imports
import Image from 'next/image'

import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import Link from '@components/Link'

// Util Imports
import { frontLayoutClasses } from '@layouts/utils/layoutClasses'

// eslint-disable-next-line import/no-duplicates
import frontCommonStyles from './styles.module.css'

// Image Imports
import UCLGOSH from '../../../../public/images/ucl-GOSH-logo.png'

import GHENTUNI from '../../../../public/images/ghent-logo.png'

const Footer = () => {
  return (
    <footer className={frontLayoutClasses.footer}>
      <div className='relative'>
        <img
          src='/images/pages/home/footer-bg.png'
          alt='footer bg'
          className='absolute inset-0 is-full bs-full object-cover -z-[1]'
        />
        <div className={classnames('plb-12 text-white', frontCommonStyles.layoutSpacing)}>
          <Grid container rowSpacing={10} columnSpacing={12} justifyContent={'center'}>
            <Grid>
              <Image src={UCLGOSH} alt='logo' width={184} height={74.1} flex-shrink={0} aspect-ration={184.0 / 74.11} />
            </Grid>
            <Grid>
              <Image src={GHENTUNI} alt='logo' width={85} height={81} />
            </Grid>
            <Grid>
              <div className='flex flex-col items-start gap-6'>
                <Typography variant='body2' className='text-white opacity-[0.92]'>
                  About
                </Typography>
                <div className='flex gap-4'>
                  <IconButton
                    component={Link}
                    size='small'
                    href='https://www.facebook.com/ThemeSelections/'
                    target='_blank'
                  >
                    <i className='ri-facebook-fill text-white text-lg' />
                  </IconButton>
                  <IconButton component={Link} size='small' href='https://twitter.com/Theme_Selection' target='_blank'>
                    <i className='ri-twitter-fill text-white text-lg' />
                  </IconButton>
                </div>
              </div>
            </Grid>
            <Grid>
              <div className='flex flex-col items-start gap-6'>
                <Typography variant='body2' className='text-white opacity-[0.92]'>
                  Team
                </Typography>
                <div className='flex gap-4'>
                  <IconButton
                    component={Link}
                    size='small'
                    href='https://www.facebook.com/ThemeSelections/'
                    target='_blank'
                  >
                    <i className='ri-pinterest-fill text-white text-lg' />
                  </IconButton>
                  <IconButton component={Link} size='small' href='https://twitter.com/Theme_Selection' target='_blank'>
                    <i className='ri-whatsapp-fill text-white text-lg' />
                  </IconButton>
                </div>
              </div>
            </Grid>
            <Grid>
              <div className='flex flex-col items-start gap-6'>
                <Typography variant='body2' className='text-white opacity-[0.92]'>
                  Resources
                </Typography>
                <div className='flex gap-4'>
                  <IconButton
                    component={Link}
                    size='small'
                    href='https://www.facebook.com/ThemeSelections/'
                    target='_blank'
                  >
                    <i className='ri-linkedin-box-fill text-white text-lg' />
                  </IconButton>
                  <IconButton
                    component={Link}
                    size='small'
                    href='https://www.facebook.com/ThemeSelections/'
                    target='_blank'
                  >
                    <i className='ri-links-fill text-white text-lg' />
                  </IconButton>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    </footer>
  )
}

export default Footer
