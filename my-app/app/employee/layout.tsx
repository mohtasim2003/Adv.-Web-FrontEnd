import type { ReactNode } from "react";
import EmployeeNavbar from "./component/EmployeeNavbar";


export default function EmployeeLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <EmployeeNavbar />
      <main>{children}</main>
    </div>
  );
}