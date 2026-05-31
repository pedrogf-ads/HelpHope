import { createBrowserRouter } from "react-router";
import LandingPage from "./screens/LandingPage";
import LoginScreen from "./screens/LoginScreen";
import DonorFlow from "./screens/DonorFlow";
import TherapistDashboard from "./screens/therapist/TherapistDashboard";
import TherapistPatients from "./screens/therapist/TherapistPatients";
import PatientDetails from "./screens/therapist/PatientDetails";
import TherapistSchedule from "./screens/therapist/TherapistSchedule";
import TherapistReports from "./screens/therapist/TherapistReports";
import TherapistInstitutional from "./screens/therapist/TherapistInstitutional";
import FamilyDashboard from "./screens/family/FamilyDashboard";
import AdminDashboard from "./screens/admin/AdminDashboard";
import AdminAccounts from "./screens/admin/AdminAccounts";
import ReceptionDashboard from "./screens/reception/ReceptionDashboard";
import ReceptionSchedule from "./screens/reception/ReceptionSchedule";
import ReceptionPatients from "./screens/reception/ReceptionPatients";
import ReceptionRoomPatients from "./screens/reception/ReceptionRoomPatients";
import TherapistLayout from "./layouts/TherapistLayout";
import FamilyLayout from "./layouts/FamilyLayout";
import AdminLayout from "./layouts/AdminLayout";
import ReceptionLayout from "./layouts/ReceptionLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginScreen />,
  },
  {
    path: "/criar-conta",
    element: <LoginScreen />,
  },
  {
    path: "/donor",
    element: <DonorFlow />,
  },
  {
    path: "/therapist",
    element: <TherapistLayout />,
    children: [
      {
        index: true,
        element: <TherapistDashboard />,
      },
      {
        path: "patients",
        element: <TherapistPatients />,
      },
      {
        path: "patients/:id",
        element: <PatientDetails />,
      },
      {
        path: "schedule",
        element: <TherapistSchedule />,
      },
      {
        path: "reports",
        element: <TherapistReports />,
      },
      {
        path: "institutional",
        element: <TherapistInstitutional />,
      },
    ],
  },
  {
    path: "/family",
    element: <FamilyLayout />,
    children: [
      {
        index: true,
        element: <FamilyDashboard />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "schedule",
        element: <ReceptionSchedule />,
      },
      {
        path: "users",
        element: <AdminDashboard />,
      },
      {
        path: "approvals",
        element: <AdminDashboard />,
      },
      {
        path: "reports",
        element: <AdminDashboard />,
      },
      {
        path: "settings",
        element: <AdminDashboard />,
      },
      {
        path: "accounts",
        element: <AdminAccounts />,
      },
    ],
  },
  {
    path: "/reception",
    element: <ReceptionLayout />,
    children: [
      {
        index: true,
        element: <ReceptionDashboard />,
      },
      {
        path: "schedule",
        element: <ReceptionSchedule />,
      },
      {
        path: "patients",
        element: <ReceptionPatients />,
      },
      {
        path: "patients/room/:roomId",
        element: <ReceptionRoomPatients />,
      },
    ],
  },
]);