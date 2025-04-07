import ResetPasswordPage from '@views/ResetPassword'

interface PageProps {
  params: Promise<{
    token: string
  }>
}

const Page = async ({ params }: PageProps) => {
  const { token } = await params

  return <ResetPasswordPage token={token} />
}

export default Page
