import { NextPage } from 'next';
import ResetPasswordPage from '@views/ResetPassword';

type Props = {
  params: {
    token: string;
  };
};

const ResetPassword: NextPage<Props> = ({ params }) => {
  return <ResetPasswordPage token={params.token} />;
};

export default ResetPassword;
