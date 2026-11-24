import AdminNavigationShell from "./admin-navigation-shell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminNavigationShell>{children}</AdminNavigationShell>;
}
