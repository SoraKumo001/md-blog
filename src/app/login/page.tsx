'use client';
import { useRouter } from 'next/navigation';
import { Button } from 'react-daisyui';
import { useSignIn } from '@/hooks/useAuth';
import { signInGoogle } from '@/libs/signInGoogle';

const Page = () => {
  const router = useRouter();
  const signIn = useSignIn();
  const handleSignIn = () => {
    signInGoogle().then((token) => {
      signIn(token).then(() => router.back());
    });
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Button onClick={handleSignIn}>SignIn</Button>
    </div>
  );
};
export default Page;
export const runtime = 'edge';
