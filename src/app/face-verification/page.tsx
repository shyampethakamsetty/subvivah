import dynamic from 'next/dynamic';

const FaceVerification = dynamic(() => import('@/components/FaceVerification'), { ssr: false });

export default function FaceVerificationPage() {
  return <FaceVerification />;
} 