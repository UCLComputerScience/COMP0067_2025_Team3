import ResetPasswordPage from '@views/ResetPassword';

interface PageProps {
  params: {
    token: string;
  };
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}

const ResetPassword = async ({ params }: PageProps) => {
  return <ResetPasswordPage token={params.token} />;
};

export default ResetPassword;
