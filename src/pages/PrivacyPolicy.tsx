import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";

const PrivacyPolicy = () => {
    return (
        <PageTransition>
            <div className="min-h-screen bg-background">
                <Navbar />

                <section className="pt-32 pb-24">
                    <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1 className="text-4xl md:text-5xl font-bold mb-8">Privacy Policy</h1>
                            <p className="text-foreground/60 mb-12">Last Updated: January 9, 2026</p>

                            <div className="space-y-12 prose prose-invert max-w-none">
                                <div>
                                    <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Introduction</h2>
                                    <p className="text-foreground/70 leading-relaxed">
                                        Welcome to CineSphere ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This Privacy Policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-semibold mb-4 text-foreground">2. The Data We Collect</h2>
                                    <p className="text-foreground/70 leading-relaxed">
                                        We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                                    </p>
                                    <ul className="list-disc pl-6 mt-4 space-y-2 text-foreground/70">
                                        <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                                        <li><strong>Contact Data:</strong> includes email address.</li>
                                        <li><strong>Technical Data:</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform.</li>
                                        <li><strong>Usage Data:</strong> includes information about how you use our website and services.</li>
                                    </ul>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-semibold mb-4 text-foreground">3. How We Use Your Data</h2>
                                    <p className="text-foreground/70 leading-relaxed">
                                        We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                                    </p>
                                    <ul className="list-disc pl-6 mt-4 space-y-2 text-foreground/70">
                                        <li>To register you as a new user.</li>
                                        <li>To manage your account and watchlist.</li>
                                        <li>To provide and maintain our Service.</li>
                                        <li>To notify you about changes to our Service.</li>
                                        <li>To provide customer support.</li>
                                    </ul>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-semibold mb-4 text-foreground">4. YouTube Data API</h2>
                                    <p className="text-foreground/70 leading-relaxed">
                                        CineSphere uses YouTube API Services to display film content. By using our service, you are also bound by the YouTube Terms of Service and Google Privacy Policy. We do not store any private YouTube user data on our servers beyond what is necessary to display the public videos you submit.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Data Security</h2>
                                    <p className="text-foreground/70 leading-relaxed">
                                        We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Your Legal Rights</h2>
                                    <p className="text-foreground/70 leading-relaxed">
                                        Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, or to object to processing.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Contact Us</h2>
                                    <p className="text-foreground/70 leading-relaxed">
                                        If you have any questions about this Privacy Policy, please contact us at: <br />
                                        <span className="text-foreground font-medium">privacy@cinesphere.com</span>
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                <Footer />
            </div>
        </PageTransition>
    );
};

export default PrivacyPolicy;
