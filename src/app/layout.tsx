import { Recursive } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/components/Providers";
import { constructMetadata } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";

const recursive = Recursive({ subsets: ['latin'] })

export const metadata = constructMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={recursive.className}
        >
          <NavBar />
          <main className="flex flex-col min-h-[calc(100vh-3.5rem-1px)] grainy-light">
            <div className="flex-1 flex flex-col h-full bg-white">
              <Providers>
                {children}
              </Providers>
            </div>
            <Footer />
          </main>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
