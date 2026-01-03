import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Film, Users, Award, Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Film,
      title: "Free for Everyone",
      description: "Submit your YouTube films completely free. No subscriptions, no hidden fees."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join a passionate community of creators and viewers from around the world."
    },
    {
      icon: Award,
      title: "Showcase Your Work",
      description: "Get your films discovered by viewers who appreciate authentic content."
    },
    {
      icon: Globe,
      title: "Global Platform",
      description: "Share films from every corner of the globe, celebrating diverse voices."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-6">
          <p className="text-xs uppercase tracking-widest text-foreground/50 mb-2">Our Story</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About CineSphere
          </h1>
          <p className="text-xl text-foreground/60 max-w-2xl leading-relaxed">
            A free platform for filmmakers and enthusiasts. Share your YouTube films 
            with the world and connect with a global community.
          </p>
        </div>
      </div>

      {/* Mission */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Our Mission</h2>
          <div className="space-y-6 text-lg text-foreground/60 leading-relaxed">
            <p>
              CineSphere was created to give filmmakers a platform to showcase their work. 
              Whether you're a professional or an aspiring creator, everyone deserves a space 
              to share their stories.
            </p>
            <p>
              We believe films have the power to educate, inspire, and change perspectives. 
              By making it easy for anyone to submit their YouTube links, we're building 
              a diverse library of stories from creators around the globe.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-card/30 py-24">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <p className="text-xs uppercase tracking-widest text-foreground/50 mb-2">Why CineSphere</p>
            <h2 className="text-2xl md:text-3xl font-bold">What Makes Us Different</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group">
                  <Icon className="h-8 w-8 mb-4 text-foreground/80" />
                  <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                  <p className="text-foreground/50 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-6 py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl">
          {[
            { value: "1000+", label: "Films" },
            { value: "Free", label: "Always" },
            { value: "100+", label: "Countries" },
            { value: "500+", label: "Creators" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-foreground/50">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 pb-24">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Start Sharing Today</h2>
          <p className="text-lg text-foreground/60 mb-8">
            Have a film on YouTube? Share it with our community. It's completely free.
          </p>
          <Button 
            className="bg-foreground text-background hover:bg-foreground/90"
            onClick={() => navigate('/auth')}
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
