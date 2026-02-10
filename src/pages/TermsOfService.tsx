import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";

const TermsOfService = () => {
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
                            <h1 className="text-4xl md:text-5xl font-bold mb-8">Terms of Service</h1>
                            <p className="text-foreground/60 mb-12">Last Updated: January 9, 2026</p>

                            <div className="space-y-12 prose prose-invert max-w-none">
                                <div>
                                    <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Agreement to Terms</h2>
                                    <p className="text-foreground/70 leading-relaxed">
                                        By accessing or using Mushroom Studios, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Use License</h2>
                                    <p className="text-foreground/70 leading-relaxed">
                                        Permission is granted to temporarily view the materials on Mushroom Studios' website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                                    </p>
                                    <ul className="list-disc pl-6 mt-4 space-y-2 text-foreground/70">
                                        <li>Modify or copy the materials.</li>
                                        <li>Use the materials for any commercial purpose.</li>
                                        <li>Attempt to decompile or reverse engineer any software contained on Mushroom Studios.</li>
                                        <li>Remove any copyright or other proprietary notations from the materials.</li>
                                    </ul>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-semibold mb-4 text-foreground">3. User Submissions</h2>
                                    <p className="text-foreground/70 leading-relaxed">
                                        When you submit a film to Mushroom Studios, you represent and warrant that:
                                    </p>
                                    <ul className="list-disc pl-6 mt-4 space-y-2 text-foreground/70">
                                        <li>You own or have the necessary licenses and permissions to share the content.</li>
                                        <li>The content is hosted on YouTube and complies with YouTube's Terms of Service.</li>
                                        <li>The content does not violate any third-party rights, including copyright and privacy rights.</li>
                                    </ul>
                                    <p className="text-foreground/70 mt-4">
                                        Mushroom Studios reserves the right to remove any submission at any time without notice.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Disclaimer</h2>
                                    <p className="text-foreground/70 leading-relaxed">
                                        The materials on Mushroom Studios' website are provided on an 'as is' basis. Mushroom Studios makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Limitations</h2>
                                    <p className="text-foreground/70 leading-relaxed">
                                        In no event shall Mushroom Studios or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Mushroom Studios' website.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Governing Law</h2>
                                    <p className="text-foreground/70 leading-relaxed">
                                        These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which Mushroom Studios operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Changes to Terms</h2>
                                    <p className="text-foreground/70 leading-relaxed">
                                        Mushroom Studios may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
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

export default TermsOfService;
