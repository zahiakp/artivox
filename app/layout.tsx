import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import PageLoader from "../components/common/Loader";
import { Bebas_Neue, Sora } from "next/font/google";
import { brandName } from "./data/branding";

export const metadata = {
  title: brandName || "Event Pro",
  description: "The Ultimate Competition Management Software",
};

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue(
  {
    variable: "--font-bebas-neue",
    weight: "400",
    subsets: ["latin"],
  });

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head></head>
      <body className={`${sora.className} ${bebasNeue.variable} antialiased`}>
        <ToastContainer />
        <PageLoader />
        {children}
      </body>
    </html>
  );
}
