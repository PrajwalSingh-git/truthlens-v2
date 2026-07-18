import { Link } from "react-router-dom";
import { ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

import Container from "../common/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-28">
      <Container>
        <div className="grid items-center gap-20 lg:grid-cols-2">
          {/* Left */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2">
              <Sparkles size={18} className="text-cyan-400" />

              <span className="text-sm font-medium text-cyan-300">
                AI Powered Misinformation Detection
              </span>
            </div>

            <h1 className="text-5xl font-black leading-tight lg:text-7xl">
              Analyze News.
              <br />
              Detect <span className="text-cyan-400">Truth.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-9 text-slate-400">
              TruthLens AI helps users identify misinformation,
              propaganda, clickbait, emotional manipulation,
              and bias through explainable AI analysis.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/analyze">
                <Button size="lg">
                  Analyze Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link to="/about">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Right */}
          <Card className="border-cyan-400/10 bg-[#091722]/80 backdrop-blur-xl shadow-2xl">
            <CardContent className="p-8">
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
                  className="h-9 w-9 text-cyan-400"
                />
              </div>

              <div className="mt-12 flex justify-center">
                <div className="flex h-56 w-56 items-center justify-center rounded-full border-[16px] border-cyan-400">
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
                <div className="mb-2 flex justify-between text-sm">
                  <span>Bias</span>
                  <span>Low</span>
                </div>

                <div className="h-3 rounded-full bg-slate-700">
                  <div className="h-full w-[22%] rounded-full bg-cyan-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
}