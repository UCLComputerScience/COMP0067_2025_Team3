import ResetPasswordPage from '@views/ResetPassword';

const ResetPassword = async ({
  params,
}: {
  params: { token: string };
}) => {
  const { token } = params;

  return <ResetPasswordPage token={token} />;
};

export default ResetPassword;
