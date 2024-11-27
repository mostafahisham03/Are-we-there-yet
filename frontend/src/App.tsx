import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import {
  ErrorPage,
  NotFoundPage,
  RootLayout,
  rootLayoutLoader,
} from "./modules/Layout/App";
import { AdminPage as AdminProducts } from "./modules/products/App";
import { AllProducts } from "./modules/products/App";
import { SellerPage as SellerProducts } from "./modules/products/App";
import { Dashboard as AdminDashboard } from "./modules/Admin/App";
import { Tag } from "./modules/Tags/App";
import { PreferenceTag } from "./modules/PreferenceTag/App";
import { Category } from "./modules/Category/App";
import {
  MyItitinerariesLoader,
  TourGuideProfile,
} from "./modules/TourGuide/App";
import { AdvertiserProfile } from "./modules/Advertiser/App";
import { SellerProfile } from "./modules/Seller/App";

import { TouristProfile, touristProfileLoader } from "./modules/Tourist/App";
import { Toaster } from "react-hot-toast";
import { AllActivities } from "./modules/shared/pages/MyActivities";
import { AllItineraries } from "./modules/shared/pages/MyItineraries";
import { AllMuseums } from "./modules/shared/pages/MyMuseums";
import { MyItineraries } from "./modules/TourGuide/pages/UsersAssets";
import { MyMuseums } from "./modules/Museums/App";
import { loader as activityLoader } from "./modules/Activity/pages/Activity";
import {
  loader as activityAddLoader,
  editLoader as activityEditLoader,
  action as activityFormAction,
} from "./modules/Activity/component/ActivityForm";
import { Activity, ActivityForm, EditActivity } from "./modules/Activity/App";
import UserContextProvider from "./modules/shared/store/user-context";
import { RouteGuard } from "./modules/shared/components/RouteGuard";
import { AccountType } from "./modules/shared/types/User.types";
import { LandingPage } from "./modules/LandingPage/App";
import Register from "./modules/Register/pages/Register";
import { registerAction, registerLoader } from "./modules/Register/App";
import AllComplaints from "./modules/Complaints/pages/AllComplaints";
import AdminAllComplaints from "./modules/Complaints/pages/AdminAllComplaints";
import LandingPageLayout from "./modules/LandingPage/pages/LadningPageLayout";
import History from "./modules/History/pages/History";
import FlagItineraries, {
  loader as flagItinerariesLoader,
} from "./modules/Admin/pages/FlagItineraries";
import { ActivityBookings } from "./modules/Tourist/pages/Bookings/ActivityBookings";
import { ItineraryBookings } from "./modules/Tourist/pages/Bookings/ItineraryBookings";
import Booking from "./modules/Booking/pages/Booking";
import { TourismGovernorProfile } from "./modules/TourismGovernor/App";
import { LoginPage } from "./modules/Login/App";

const BrowserRouter = createBrowserRouter([
  {
    path: "/",
    element: <LandingPageLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "all-activities/*",
        element: <AllActivities />,
      },
      {
        path: "all-itineraries/*",
        element: <AllItineraries />,
      },
      {
        path: "all-museums/*",
        element: <AllMuseums />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <Register />,
    action: registerAction,
    loader: registerLoader,
  },
  {
    path: "/home",
    id: "root",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    loader: rootLayoutLoader,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "all-activities/*",
        element: <AllActivities />,
      },
      {
        path: "all-itineraries/*",
        element: <AllItineraries />,
      },
      {
        path: "all-museums/*",
        element: <AllMuseums />,
      },
      {
        path: "all-products",
        element: <AllProducts />,
      },
      {
        path: "tourism-governor-profile/:id",
        element: <TourismGovernorProfile />,
      },
      {
        path: "tour-guide-profile/:id",
        element: (
          <RouteGuard account_types={[AccountType.TourGuide]}>
            <TourGuideProfile />
          </RouteGuard>
        ),
      },
      {
        path: "advertiser-profile/:id",
        element: (
          <RouteGuard account_types={[AccountType.Advertiser]}>
            <AdvertiserProfile />,
          </RouteGuard>
        ),
      },
      {
        path: "seller-profile/:id",
        element: (
          <RouteGuard account_types={[AccountType.Seller]}>
            <SellerProfile />,
          </RouteGuard>
        ),
      },
      {
        path: "tourist-profile/:id",
        element: (
          <RouteGuard account_types={[AccountType.Tourist]}>
            <TouristProfile />
          </RouteGuard>
        ),
        loader: touristProfileLoader,
      },
      {
        path: "my-products-seller",
        element: <SellerProducts />,
      },
      {
        path: "admin-dashboard",
        children: [
          {
            index: true,
            element: <AdminDashboard />,
          },
          {
            path: "preference-tags",
            element: <PreferenceTag />,
          },
          {
            path: "activity-categories",
            element: <Category />,
          },
          {
            path: "my-products-admin",
            element: <AdminProducts />,
          },
          {
            path: "flag-itineraries",
            element: <FlagItineraries />,
            loader: flagItinerariesLoader,
          },
          {
            path: "admin-complaints",
            element: <AdminAllComplaints />,
          },
        ],
      },
      {
        path: "my-tags",
        element: <Tag />,
      },
      {
        path: "my-itineraries",
        element: <MyItineraries />,
        loader: MyItitinerariesLoader,
      },
      {
        path: "my-museums",
        element: <MyMuseums />,
      },
      {
        path: "my-complaints",
        element: <AllComplaints />,
      },
      {
        path: "history",
        element: <History />,
      },
      {
        path: "activity-bookings",
        element: <ActivityBookings />,
      },
      {
        path: "itinerary-bookings",
        element: <ItineraryBookings />,
      },
      {
        path: "transportation-bookings",
        element: <Booking />,
      },
      {
        path: "my-activities",
        element: (
          <RouteGuard account_types={[AccountType.Advertiser]}>
            <Outlet />,
          </RouteGuard>
        ),
        children: [
          {
            index: true,
            element: <Activity />,
            loader: activityLoader,
          },
          {
            path: "add",
            element: <ActivityForm method="post" />,
            action: activityFormAction,
            loader: activityAddLoader,
          },
          {
            path: "edit/:activityId",
            element: <EditActivity />,
            action: activityFormAction,
            loader: activityEditLoader,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: { duration: 3000 },
          error: { duration: 4000 },
          style: {
            fontSize: "16px",
            lineHeight: "1.5",
            maxWidth: "500px",
            padding: "16px 24px",
            background: "white",
            margin: "5px",
            display: "absolute",
          },
        }}
      />
      <UserContextProvider>
        <RouterProvider router={BrowserRouter} />
      </UserContextProvider>
    </>
  );
}

export default App;