import Intro from './Intro'
import Funding from './Funding'

const HomeWrapper = () => {
  return (
    <>
      <Intro />
      <div className='h-10 bg-backgroundDefault'></div>
      <Funding />
      <div className='h-40 bg-backgroundDefault'></div>
    </>
  )
}

export default HomeWrapper
