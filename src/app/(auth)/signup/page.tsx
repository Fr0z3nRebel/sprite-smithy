import SignupForm from '@/components/auth/SignupForm';
import OAuthButtons from '@/components/auth/OAuthButtons';

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <SignupForm />
      <OAuthButtons />
    </div>
  );
}
