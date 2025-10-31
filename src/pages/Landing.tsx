import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedProperties from "@/components/FeaturedProperties";
import ContactForm from "@/components/ContactForm";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <Hero />
        <FeaturedProperties />
        <ContactForm />
      </main>
      
      {/* Floating Chatbot Button */}
      <Button
        size="lg"
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 p-0 shadow-card-hover"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
      
      <footer className="bg-card border-t border-border py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 ImobiSmart. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
