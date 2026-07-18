import {
  Brain,
  ShieldCheck,
  SearchCheck,
  Newspaper,
  BarChart3,
  BadgeCheck,
} from "lucide-react";

import Container from "../common/Container";
import SectionTitle from "../common/SectionTitle";
import GlassCard from "../common/GlassCard";

const features = [
  {
    icon: Brain,
    title: "Explainable AI",
    desc: "Receive AI-generated explanations instead of a simple true or false result.",
  },
  {
    icon: ShieldCheck,
    title: "Credibility Score",
    desc: "Evaluate trustworthiness using multiple AI confidence signals.",
  },
  {
    icon: SearchCheck,
    title: "Fact Verification",
    desc: "Cross-check claims using AI-assisted contextual reasoning.",
  },
  {
    icon: Newspaper,
    title: "Propaganda Detection",
    desc: "Detect emotionally manipulative and misleading narratives.",
  },
  {
    icon: BarChart3,
    title: "Visual Analytics",
    desc: "Understand results through intuitive graphs and metrics.",
  },
  {
    icon: BadgeCheck,
    title: "Report Generation",
    desc: "Save and export professional credibility reports.",
  },
];

export default function Features() {
  return (
    <section className="py-28">

      <Container>

        <SectionTitle
          badge="Features"
          title="Powerful AI Analysis"
          description="TruthLens AI combines multiple analysis engines to evaluate online content with explainable and transparent results."
        />

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <GlassCard
                key={feature.title}
                className="group p-8 transition duration-300 hover:-translate-y-2 hover:border-cyan-400/30"
              >

                <div className="mb-6 inline-flex rounded-2xl bg-cyan-500/10 p-4">

                  <Icon
                    size={28}
                    className="text-cyan-400"
                  />

                </div>

                <h3 className="text-2xl font-bold">

                  {feature.title}

                </h3>

                <p className="mt-4 leading-8 text-slate-400">

                  {feature.desc}

                </p>

              </GlassCard>
            );
          })}

        </div>

      </Container>
    </section>
  );
}