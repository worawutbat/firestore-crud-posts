import React from "react";
import Nav from "./Nav";

interface IPropsLayout {
  children: React.ReactNode;
}

function Layout({ children }: IPropsLayout) {
  return (
    <div className="mx-6 md:max-w-2xl md:mx-auto font-marck">
      <Nav />
      <main>{children}</main>
    </div>
  );
}

export default Layout;
