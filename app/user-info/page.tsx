import { auth } from "@/auth";
import Image from "next/image";
import React from "react";

const UserInfo = async () => {
  const session = await auth();
  return (
    <div>
      {""}
      <h1>User Information</h1>
      <p>Name: {session?.user?.name}</p>
      <p>Email: {session?.user?.email}</p>
      {session?.user?.image && <Image src={session?.user?.image} alt="avatar" width={48} height={48}  style={{borderRadius: '50%'}}/>}
    </div>
  );
};

export default UserInfo;
