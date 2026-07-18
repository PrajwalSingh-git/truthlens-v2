import { Link } from "react-router-dom";
import Container from "../common/Container";
import PrimaryButton from "../common/PrimaryButton";

export default function CTA() {
  return (
    <section className="py-32">

      <Container>

        <div className="overflow-hidden rounded-[40px] border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-transparent p-16">

          <div className="mx-auto max-w-3xl text-center">

            <h2 className="text-5xl font-black">

              Ready to Verify
              <span className="text-cyan-400">
                {" "}Information?
              </span>

            </h2>

            <p className="mt-8 text-lg leading-9 text-slate-400">

              Start analyzing news articles, social media posts,
              and online content with AI-powered explainable
              credibility analysis.

            </p>

            <div className="mt-12">

              <Link to="/analyze">

                <PrimaryButton>

                  Start Free Analysis

                </PrimaryButton>

              </Link>

            </div>

          </div>

        </div>

      </Container>

    </section>
  );
}