import ResetPasswordScreen from "@/components/auth/ResetPasswordScreen";

export default function ResetPasswordPage({ searchParams }: { searchParams: { token?: string } }) {
  const token = searchParams?.token;
  return <ResetPasswordScreen token={token} />;
}
