import Footer from "@components/Footer";
import NavBar from "@components/NavBar";
import { ReactNode } from "react";

export default function DefaultLayout({ children }: { children: ReactNode }) {
    return (
        <div className="relative flex min-h-screen flex-col">
            <NavBar />
            <main className="container flex-1 flex-grow">{children}</main>
            <Footer />
        </div>
    );
}
