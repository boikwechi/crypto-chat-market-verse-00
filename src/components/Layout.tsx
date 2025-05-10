
import { ReactNode } from "react";
import Navbar from "./Navbar";
import { cn } from "@/lib/utils";

type LayoutProps = {
  children: ReactNode;
  className?: string;
};

const Layout = ({ children, className }: LayoutProps) => {
  return (
    <>
      <Navbar />
      <main className={cn(
        "pt-16 pb-16 md:pt-16 md:pb-0 min-h-screen",
        className
      )}>
        <div className="container mx-auto p-4">
          {children}
        </div>
      </main>
    </>
  );
};

export default Layout;
