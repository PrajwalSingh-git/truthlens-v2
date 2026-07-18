import { Card, CardContent } from "@/components/ui/card";

export default function AuthCard({
  title,
  subtitle,
  children,
}) {
  return (
    <Card className="w-full max-w-md border-white/10 bg-black/40 backdrop-blur-xl">

      <CardContent className="p-8">

        <h1 className="text-3xl font-bold">

          {title}

        </h1>

        <p className="mt-2 text-slate-400">

          {subtitle}

        </p>

        <div className="mt-8">

          {children}

        </div>

      </CardContent>

    </Card>
  );
}