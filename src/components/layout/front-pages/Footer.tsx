// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import Link from '@components/Link'
import Logo from '@components/layout/shared/Logo'

// Util Imports
import { frontLayoutClasses } from '@layouts/utils/layoutClasses'

// Styles Imports
import styles from './styles.module.css'
import frontCommonStyles from './styles.module.css'

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
          <Grid container rowSpacing={10} columnSpacing={12}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <div className='flex flex-col items-start gap-6'>
                <Link href='/front-pages/landing-page'>
                  <Logo color='var(--mui-palette-common-white)' />
                </Link>
                <Typography color='white' className='lg:max-is-[390px] opacity-[0.78]'>
                  Most Powerful & Comprehensive 🤩 React NextJS Admin Template with Elegant Material Design & Unique
                  Layouts.
                </Typography>
                <div className='flex gap-4'>
                  <TextField
                    size='small'
                    className={styles.inputBorder}
                    label='Subscribe to newsletter'
                    placeholder='Your email'
                    sx={{
                      ' & .MuiInputBase-root:hover:not(.Mui-focused) fieldset': {
                        borderColor: 'rgb(var(--mui-mainColorChannels-dark) / 0.6) !important'
                      },
                      '& .MuiInputBase-root.Mui-focused fieldset': {
                        borderColor: 'var(--mui-palette-primary-main)!important'
                      },
                      '& .MuiFormLabel-root.Mui-focused': {
                        color: 'var(--mui-palette-primary-main) !important'
                      }
                    }}
                  />
                  <Button variant='contained' color='primary'>
                    Subscribe
                  </Button>
                </div>
              </div>
            </Grid>
            <Grid size={{ xs: 12, sm: 3, lg: 2 }}>
              <Typography color='white' className='font-medium mbe-6 opacity-[0.92]'>
                Pages
              </Typography>
              <div className='flex flex-col gap-4'>
                <Typography component={Link} href='/front-pages/pricing' color='white' className='opacity-[0.78]'>
                  Pricing
                </Typography>
                <Link href='/front-pages/payment' className='flex items-center gap-[10px]'>
                  <Typography color='white' className='opacity-[0.78]'>
                    Payment
                  </Typography>
                  <Chip label='New' color='primary' size='small' />
                </Link>
                <Typography
                  component={Link}
                  href='/pages/misc/under-maintenance'
                  color='white'
                  className='opacity-[0.78]'
                >
                  Maintenance
                </Typography>
                <Typography component={Link} href='/pages/misc/coming-soon' color='white' className='opacity-[0.78]'>
                  Coming Soon
                </Typography>
              </div>
            </Grid>
            <Grid size={{ xs: 12, sm: 3, lg: 2 }}>
              <Typography color='white' className='font-medium mbe-6 opacity-[0.92]'>
                Products
              </Typography>
              <div className='flex flex-col gap-4'>
                <Typography component={Link} href='/front-pages/landing-page' color='white' className='opacity-[0.78]'>
                  Page builder
                </Typography>
                <Typography component={Link} href='/front-pages/landing-page' color='white' className='opacity-[0.78]'>
                  Admin Dashboards
                </Typography>
                <Typography component={Link} href='/front-pages/landing-page' color='white' className='opacity-[0.78]'>
                  UI Kits
                </Typography>
                <Typography component={Link} href='/front-pages/landing-page' color='white' className='opacity-[0.78]'>
                  Illustrations
                </Typography>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
      <div className='bg-[#211B2C]'>
        <div
          className={classnames(
            'flex flex-wrap items-center justify-center sm:justify-between gap-4 plb-[15px]',
            frontCommonStyles.layoutSpacing
          )}
        >
          <Typography className='text-white opacity-[0.92]' variant='body2'>
            <span>{`© ${new Date().getFullYear()}, Made with `}</span>
            <span>{`❤️`}</span>
            <span>{` by `}</span>
            <Link
              href='https://mui.com/store/contributors/themeselection'
              target='_blank'
              className='font-medium text-white'
            >
              ThemeSelection
            </Link>
          </Typography>
          <div className='flex gap-6 items-center'>
            <IconButton component={Link} size='small' href='https://github.com/themeselection' target='_blank'>
              <i className='ri-github-fill text-white text-lg' />
            </IconButton>
            <IconButton component={Link} size='small' href='https://www.facebook.com/ThemeSelections/' target='_blank'>
              <i className='ri-facebook-fill text-white text-lg' />
            </IconButton>
            <IconButton component={Link} size='small' href='https://twitter.com/Theme_Selection' target='_blank'>
              <i className='ri-twitter-fill text-white text-lg' />
            </IconButton>
            <IconButton
              component={Link}
              size='small'
              href='https://in.linkedin.com/company/themeselection'
              target='_blank'
            >
              <i className='ri-linkedin-fill text-white text-lg' />
            </IconButton>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
