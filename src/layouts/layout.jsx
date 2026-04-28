import { Outlet } from 'react-router-dom';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import {
  Sidenav,
  DashboardNavbar,
  Footer,
} from '@/widgets/layout';
import { useMaterialTailwindController } from '@/context';
import { useSelector } from 'react-redux';
import RibbonInvite from '@/pages/dashboard/component/RibbonInvite';
import { USER_ROLES } from '@/constants/user.constants';

function MainLayoutContent() {
  const [controller] = useMaterialTailwindController();
  const { darkMode } = useTheme();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === USER_ROLES.ADMIN || user?.role === USER_ROLES.SUPER_ADMIN;

  return (
    <div className="">
      {!isAdmin && <RibbonInvite />}
      <div className="flex min-h-screen bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text pt-4">
        <Sidenav
          brandImg={darkMode ? "/img/aitek_logo_light.png" : "/img/aitek_logo_dark.png"}
          brandName="Aitek Solutions"
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardNavbar />
          <main className="p-4 overflow-auto">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export function MainLayout() {
  return (
    <ThemeProvider>
      <MainLayoutContent />
    </ThemeProvider>
  );
}

export default MainLayout;
