import { Container } from '@/components/common/container';
import { NavbarMenu } from './navbar-menu';

export function Navbar() {
  return (
    <div className="border-b border-border pb-5 lg:pb-0 mb-5 lg:mb-10">
      <Container className="flex flex-wrap justify-between items-center gap-2">
        <NavbarMenu />
      </Container>
    </div>
  );
}
