import ResetPasswordScreen from "@/components/auth/ResetPasswordScreen";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = params?.token;
  return <ResetPasswordScreen token={token} />;
}
