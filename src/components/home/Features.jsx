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

import { Card, CardContent } from "@/components/ui/card";

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
          description="TruthLens AI combines multiple AI models to evaluate online content."
        />

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card
                key={feature.title}
                className="transition hover:-translate-y-2 hover:border-cyan-400/40"
              >
                <CardContent className="p-8">

                  <div className="mb-6 inline-flex rounded-xl bg-cyan-500/10 p-4">

                    <Icon className="h-7 w-7 text-cyan-400" />

                  </div>

                  <h3 className="text-2xl font-bold">

                    {feature.title}

                  </h3>

                  <p className="mt-4 text-slate-400 leading-8">

                    {feature.desc}

                  </p>

                </CardContent>
              </Card>
            );
          })}

        </div>

      </Container>
    </section>
  );
}