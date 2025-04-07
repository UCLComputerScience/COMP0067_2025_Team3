import ResetPasswordPage from '@views/ResetPassword';

type Props = {
  params: {
    token: string;
  };
};

const ResetPassword = async ({ params }: Props) => {
  return <ResetPasswordPage token={params.token} />;
};

export default ResetPassword;
