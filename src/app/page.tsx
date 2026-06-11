import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import Services from '@/components/Services'
import WhyUs from '@/components/WhyUs'
import Team from '@/components/Team'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero />
      <Stats />
      <Services />
      <WhyUs />
      <Team />
      <Contact />
      <Footer />
    </main>
  )
}
