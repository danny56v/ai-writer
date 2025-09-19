import Navbar from "@/components/Navbar";
import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <SessionProvider>
        {/* <div className="mb-32"> */}
        <Navbar />

        {/* </div> */}

        {children}
      </SessionProvider>
    </div>
  );
};

export default layout;
