import Header from './components/Header'
import Hero from './components/Hero'
import ScannerDemo from './components/ScannerDemo'
import RipenessDemo from './components/RipenessDemo'
import NutritionInfo from './components/NutritionInfo'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <main>
        <Hero />
        <ScannerDemo />
        <RipenessDemo />
        <NutritionInfo />
      </main>
      <Footer />
    </div>
  )
}

export default App
