import Footer from "@components/Footer";
import NavBar from "@components/NavBar";
import { ReactNode } from "react";

export default function DefaultLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavBar />
      <main className="container">{children}</main>
      <Footer />
    </>
  );
}
