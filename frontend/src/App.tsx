import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './modules/shared/pages/RootLayout';
import {UsersAssets} from './modules/TourGuide/pages/UsersAssets';
import { TourGuideProfile } from './modules/TourGuide/App';
import { generalSettingAction } from './modules/TourGuide/App';
import { AdvertiserProfile } from './modules/Advertiser/App';
import { SellerProfile } from './modules/Seller/App';

const BrowserRouter = createBrowserRouter([
  { path: '/', element: <RootLayout />, children: [] },
  {
    path: '/tour-guide-profile',
    element: <TourGuideProfile />,
    action: generalSettingAction,
  },
  {
    path: '/advertiser-profile',
    element: <AdvertiserProfile />,
    action: generalSettingAction,
  },
  {
    path: '/seller-profile',
    element: <SellerProfile />,
  },
  {
    path: '/users-assets',
    element: <UsersAssets />,
  },
]);

function App() {
  return <RouterProvider router={BrowserRouter} />;
}

export default App;
