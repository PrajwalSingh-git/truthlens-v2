import { Link } from "react-router-dom";
import { ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

import Container from "../common/Container";
import PrimaryButton from "../common/PrimaryButton";
import SecondaryButton from "../common/SecondaryButton";

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-28">

      <Container>

        <div className="grid items-center gap-20 lg:grid-cols-2">

          <div>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2">

              <Sparkles
                size={18}
                className="text-cyan-400"
              />

              <span className="text-sm font-medium text-cyan-300">
                AI Powered Misinformation Detection
              </span>

            </div>

            <h1 className="text-5xl font-black leading-tight lg:text-7xl">

              Analyze News.

              <br />

              Detect

              <span className="text-cyan-400">
                {" "}
                Truth.
              </span>

            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-9 text-slate-400">

              TruthLens AI helps users identify misinformation,
              propaganda, clickbait and emotional manipulation
              through explainable AI analysis.

            </p>

            <div className="mt-10 flex flex-wrap gap-4">

              <Link to="/analyze">
                <PrimaryButton>

                  Analyze Now

                  <ArrowRight
                    size={18}
                    className="ml-2 inline"
                  />

                </PrimaryButton>
              </Link>

              <Link to="/about">
                <SecondaryButton>
                  Learn More
                </SecondaryButton>
              </Link>

            </div>

          </div>

          <div className="relative">

            <div className="rounded-3xl border border-cyan-400/10 bg-[#091722]/80 p-8 backdrop-blur-xl shadow-2xl">

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="text-2xl font-bold">

                    AI Confidence

                  </h3>

                  <p className="text-slate-400">

                    Credibility Score

                  </p>

                </div>

                <ShieldCheck
                  className="text-cyan-400"
                  size={36}
                />

              </div>

              <div className="mt-12 flex justify-center">

                <div className="relative flex h-56 w-56 items-center justify-center rounded-full border-[16px] border-cyan-400">

                  <div>

                    <div className="text-center text-6xl font-black">

                      94

                    </div>

                    <div className="mt-2 text-center tracking-[0.35em] text-slate-400">

                      CONFIDENCE

                    </div>

                  </div>

                </div>

              </div>

              <div className="mt-10">

                <div className="mb-2 flex justify-between">

                  <span>Bias</span>

                  <span>Low</span>

                </div>

                <div className="h-3 rounded-full bg-slate-700">

                  <div className="h-full w-[22%] rounded-full bg-cyan-400" />

                </div>

              </div>

            </div>

          </div>

        </div>

      </Container>

    </section>
  );
}