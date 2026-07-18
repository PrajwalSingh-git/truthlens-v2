import Container from "../common/Container";

const stats = [
  {
    number: "10K+",
    label: "Articles Analysed"
  },
  {
    number: "95%",
    label: "Detection Accuracy"
  },
  {
    number: "24/7",
    label: "AI Availability"
  },
  {
    number: "6+",
    label: "Analysis Metrics"
  }
];

export default function Stats() {
  return (
    <section className="pb-24">

      <Container>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {stats.map((item) => (

            <div
              key={item.label}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
            >

              <div className="text-5xl font-black text-cyan-400">

                {item.number}

              </div>

              <div className="mt-3 text-slate-400">

                {item.label}

              </div>

            </div>

          ))}

        </div>

      </Container>

    </section>
  );
}