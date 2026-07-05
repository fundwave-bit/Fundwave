import { Routes, Route } from "react-router-dom"
import { PublicLayout } from "@/layouts/PublicLayout"
import { DashboardLayout } from "@/layouts/DashboardLayout"
import { AdminLayout } from "@/layouts/AdminLayout"
import { HomePage } from "@/pages/Home"
import { CampaignDetailPage } from "@/pages/CampaignDetail"
import { LoginPage } from "@/pages/Login"
import { DashboardPage } from "@/pages/Dashboard"
import { DashboardCampaignsPage } from "@/pages/DashboardCampaigns"
import { CreateCampaignPage } from "@/pages/CreateCampaign"
import { DashboardCampaignDetailPage } from "@/pages/DashboardCampaignDetail"
import { DashboardDonationsPage } from "@/pages/DashboardDonations"
import { DashboardWithdrawalsPage } from "@/pages/DashboardWithdrawals"
import { AdminDashboardPage } from "@/pages/AdminDashboard"
import { AdminDonationsPage } from "@/pages/AdminDonations"
import { AdminCampaignsPage } from "@/pages/AdminCampaigns"
import { AdminWithdrawalsPage } from "@/pages/AdminWithdrawals"
import { AdminLedgerPage } from "@/pages/AdminLedger"

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/campaign/:slug" element={<CampaignDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/campaigns" element={<DashboardCampaignsPage />} />
        <Route path="/dashboard/campaigns/new" element={<CreateCampaignPage />} />
        <Route path="/dashboard/campaigns/:id" element={<DashboardCampaignDetailPage />} />
        <Route path="/dashboard/donations" element={<DashboardDonationsPage />} />
        <Route path="/dashboard/withdrawals" element={<DashboardWithdrawalsPage />} />
      </Route>
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/donations" element={<AdminDonationsPage />} />
        <Route path="/admin/campaigns" element={<AdminCampaignsPage />} />
        <Route path="/admin/withdrawals" element={<AdminWithdrawalsPage />} />
        <Route path="/admin/ledger" element={<AdminLedgerPage />} />
      </Route>
    </Routes>
  )
}
