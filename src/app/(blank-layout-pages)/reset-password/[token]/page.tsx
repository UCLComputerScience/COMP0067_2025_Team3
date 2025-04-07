import ResetPasswordPage from '@views/ResetPassword';

interface PageProps {
  params: {
    token: string
  }
}

const ResetPassword = async ({ params }: PageProps) => {
  const { token } = params;

  return <ResetPasswordPage token={token} />
}

export default ResetPassword;
