import Navbar from './Navbar';
import Footer from './Footer';
import AnimatedOutlet from './AnimatedOutlet';
import SOSButton from '../emergency/SOSButton';
import InstallBanner from '../ui/InstallBanner';
import OfflineBanner from '../ui/OfflineBanner';
import SkipToContent from '../ui/SkipToContent';
import AccessibilityPanel from '../ui/AccessibilityPanel';

function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SkipToContent />
      <OfflineBanner />
      <Navbar />
      <InstallBanner />
      <main id="main-content" className="flex flex-1 flex-col" role="main">
        <AnimatedOutlet />
      </main>
      <Footer />
      <SOSButton />
      <AccessibilityPanel />
    </div>
  );
}

export default Layout;
