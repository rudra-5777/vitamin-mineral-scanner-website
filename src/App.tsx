import './index.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import ScannerDemo from './components/ScannerDemo'
import RipenessDemo from './components/RipenessDemo'
import DiseaseCompatibility from './components/DiseaseCompatibility'
import AgentDashboard from './components/AgentDashboard'
import TechStack from './components/TechStack'
import ApiDocs from './components/ApiDocs'
import GettingStarted from './components/GettingStarted'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <ScannerDemo />
        <RipenessDemo />
        <DiseaseCompatibility />
        <AgentDashboard />
        <TechStack />
        <ApiDocs />
        <GettingStarted />
      </main>
      <Footer />
    </div>
  )
}

export default App
