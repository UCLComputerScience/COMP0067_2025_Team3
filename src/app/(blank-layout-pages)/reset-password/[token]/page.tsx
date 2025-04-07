import ResetPasswordPage from '@views/ResetPassword';

export default function ResetPassword({
  params: { token },
}: {
  params: { token: string };
}) {
  return <ResetPasswordPage token={token} />;
}
