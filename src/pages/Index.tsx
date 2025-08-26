import Header from "@/components/Header";
import Hero from "@/components/Hero";
import OpportunityBrowser from "@/components/OpportunityBrowser";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <OpportunityBrowser />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
