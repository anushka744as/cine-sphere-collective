import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl">
            <p className="text-xs uppercase tracking-widest text-foreground/50 mb-4">
              About Us
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8">
              A Platform for
              <br />
              Independent Cinema
            </h1>
            <p className="text-xl text-foreground/60 leading-relaxed">
              Mushroom Studios is a curated destination for film lovers and creators. 
              We believe in the power of storytelling and the importance of 
              giving independent filmmakers a platform to share their work.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 border-t border-foreground/10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <p className="text-xs uppercase tracking-widest text-foreground/50 mb-4">
                Our Mission
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                Democratizing Film Distribution
              </h2>
            </div>
            <div className="space-y-6 text-foreground/70 leading-relaxed">
              <p>
                We started Mushroom Studios with a simple idea: every filmmaker deserves 
                an audience. Whether you're a seasoned director or just starting out, 
                your stories matter.
              </p>
              <p>
                Our platform connects filmmakers with viewers who appreciate 
                quality cinema. We curate content that challenges, inspires, and 
                entertains—films that might otherwise go unseen.
              </p>
              <p>
                By leveraging YouTube's infrastructure, we make it easy for creators 
                to submit their work and reach a global audience without the 
                traditional barriers of film distribution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 border-t border-foreground/10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <p className="text-xs uppercase tracking-widest text-foreground/50 mb-4">
              What We Believe
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">Our Values</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-xl font-medium mb-4">Accessibility</h3>
              <p className="text-foreground/60 leading-relaxed">
                Cinema should be accessible to everyone—both to watch and to create. 
                Our platform is free for filmmakers and viewers alike.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-4">Quality</h3>
              <p className="text-foreground/60 leading-relaxed">
                We curate carefully. Every film on our platform is reviewed to 
                ensure it meets our standards for storytelling and craft.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-4">Community</h3>
              <p className="text-foreground/60 leading-relaxed">
                We're building more than a platform—we're fostering a community 
                of creators and cinema enthusiasts who share a passion for film.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 border-t border-foreground/10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl">
            {[
              { value: "1000+", label: "Films" },
              { value: "Free", label: "Always" },
              { value: "100+", label: "Countries" },
              { value: "500+", label: "Creators" },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-foreground/50 uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-foreground/10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Share Your Film?
            </h2>
            <p className="text-lg text-foreground/60 mb-10">
              Join our community of filmmakers and get your work seen by 
              audiences who appreciate quality cinema.
            </p>
            <button
              onClick={() => navigate("/auth")}
              className="group inline-flex items-center gap-3 text-foreground border border-foreground/30 px-8 py-4 hover:bg-foreground hover:text-background transition-all duration-300"
            >
              <span className="text-sm uppercase tracking-widest">Submit Your Film</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
