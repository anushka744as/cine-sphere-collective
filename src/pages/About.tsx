import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Film, Users, Award, Globe } from "lucide-react";
import { motion } from "framer-motion";

const About = () => {
  const features = [
    {
      icon: Film,
      title: "Free for Everyone",
      description: "Submit your YouTube documentaries completely free. No subscriptions, no hidden fees, no paywalls."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join a passionate community of documentary creators and viewers from around the world."
    },
    {
      icon: Award,
      title: "Showcase Your Work",
      description: "Get your documentaries discovered by viewers who appreciate real stories and authentic content."
    },
    {
      icon: Globe,
      title: "Global Platform",
      description: "Share documentaries from every corner of the globe, celebrating diverse voices and perspectives."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <motion.div 
        className="pt-24 pb-12 bg-gradient-to-b from-background via-card/20 to-background"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About CineSphere
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
            A free platform for documentary creators and enthusiasts. Share your YouTube documentaries 
            with the world, discover compelling stories, and connect with a global community of creators.
          </p>
        </div>
      </motion.div>

      {/* Mission */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
          <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
            <p>
              CineSphere was created to give documentary creators a platform to showcase their work. 
              Whether you're a professional filmmaker or an aspiring creator, everyone deserves a space 
              to share their stories with the world - completely free.
            </p>
            <p>
              We believe documentaries have the power to educate, inspire, and change perspectives. 
              By making it easy for anyone to submit their YouTube documentary links, we're building 
              a diverse library of real stories from creators around the globe.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          What Makes Us Different
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-card/50 border-border hover:border-primary/50 transition-colors h-full">
                  <CardContent className="p-6">
                    <Icon className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {[
            { value: "1000+", label: "Documentaries" },
            { value: "Free", label: "Always" },
            { value: "100+", label: "Countries" },
            { value: "500+", label: "Creators" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Sharing Today</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Have a documentary on YouTube? Share it with our community! Sign up, submit your 
            YouTube link, and reach viewers who are passionate about real stories and authentic content. 
            It's completely free and always will be.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;

