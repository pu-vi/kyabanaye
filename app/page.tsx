import { Button, Card, Chip } from "@heroui/react";
import { FiCalendar, FiClock, FiShare2 } from "react-icons/fi";

const highlights = [
  "Plan breakfasts, lunches, dinners, and snacks",
  "Share a weekly menu with family or roommates",
  "Keep recipes and dishes organized in one place",
];

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl rounded-3xl border border-white/70 bg-white/80 p-8 shadow-xl backdrop-blur sm:p-10 lg:p-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <Chip color="warning" className="mb-4">
              Weekly meal planning made lighter
            </Chip>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Build a simple weekly meal plan you can actually follow.
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Kyabana Ye helps you organize dishes for each day, share plans
              with others, and keep your schedule feeling calm instead of
              chaotic.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="lg">Start planning</Button>
              <Button variant="outline" size="lg">
                View schema preview
              </Button>
            </div>
          </div>

          <Card className="w-full max-w-md border border-slate-200 bg-slate-50/80 shadow-sm">
            <div className="p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-amber-100 p-3 text-amber-700">
                  <FiCalendar size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    This week
                  </p>
                  <p className="text-lg font-semibold text-slate-900">
                    Monday to Sunday
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {highlights.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl bg-white p-3 shadow-sm"
                  >
                    <div className="mt-0.5 rounded-full bg-emerald-100 p-2 text-emerald-700">
                      {item.includes("share") ? (
                        <FiShare2 size={16} />
                      ) : (
                        <FiClock size={16} />
                      )}
                    </div>
                    <p className="text-sm text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
