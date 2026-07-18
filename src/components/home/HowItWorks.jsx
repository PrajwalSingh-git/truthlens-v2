import Container from "../common/Container";
import SectionTitle from "../common/SectionTitle";

const steps = [
  {
    id: "01",
    title: "Paste Content",
    desc: "Paste text or provide an article URL.",
  },
  {
    id: "02",
    title: "AI Processing",
    desc: "Our AI evaluates credibility, propaganda, bias and manipulation.",
  },
  {
    id: "03",
    title: "Receive Insights",
    desc: "Explore detailed explanations, metrics and recommendations.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-28">

      <Container>

        <SectionTitle
          badge="Workflow"
          title="Three Simple Steps"
          description="TruthLens makes credibility analysis fast, transparent and understandable."
        />

        <div className="mt-20 grid gap-10 lg:grid-cols-3">

          {steps.map((step) => (

            <div
              key={step.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-10"
            >

              <div className="text-6xl font-black text-cyan-400">

                {step.id}

              </div>

              <h3 className="mt-6 text-2xl font-bold">

                {step.title}

              </h3>

              <p className="mt-5 leading-8 text-slate-400">

                {step.desc}

              </p>

            </div>

          ))}

        </div>

      </Container>
    </section>
  );
}