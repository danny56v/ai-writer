import Navbar from "@/components/Navbar";
import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <SessionProvider>
        <Navbar />
        <div></div>
        {children}
      </SessionProvider>
    </div>
  );
};

export default layout;
