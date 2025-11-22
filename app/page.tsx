import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import Features from "@/components/features"
import Products from "@/components/products"
import CraftedSection from "@/components/crafted-section"
import Footer from "@/components/footer"

import Home2 from "../app/Component/Home/page"
import DashBoard from "../app/Component/Admin/dashboard/page"



import ProductCarausal from "../app/Component/SectionComponents/ProductCoarausal/page"

export default function Home() {
  return (
    <main className="min-h-screen ">
      {/* <Navbar /> */}
      {/* <Home2 /> */}
      <DashBoard />
      {/* <ProductCarausal/>
      <Hero />
      <Features />
      <Products />
      <CraftedSection />
      <Footer /> */}

    
    </main>
  )
}
