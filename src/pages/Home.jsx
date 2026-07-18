import Layout from "../components/layout/Layout";
import Background from "../components/common/Background";

import Hero from "../components/home/Hero";
import Stats from "../components/home/Stats";
import Features from "../components/home/Features";
import HowItWorks from "../components/home/HowItWorks";
import CTA from "../components/home/CTA";

export default function Home() {
  return (
    <Layout>

      <Background />

      <Hero />

      <Stats />

      <Features />

      <HowItWorks />

      <CTA />

    </Layout>
  );
}