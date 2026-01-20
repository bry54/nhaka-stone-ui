import { Container } from '@/components/common/container';

export function AuthGetStartedPage() {
  return (
    <Container>
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Get Started</h1>
          <p className="text-gray-600">Welcome to the application</p>
        </div>
      </div>
    </Container>
  );
}
