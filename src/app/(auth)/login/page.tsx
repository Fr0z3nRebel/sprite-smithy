import LoginForm from '@/components/auth/LoginForm';
import OAuthButtons from '@/components/auth/OAuthButtons';

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <LoginForm />
      <OAuthButtons />
    </div>
  );
}
