interface Step {
  number: number;
  label: string;
}

interface ProductFormStepperProps {
  steps: Step[];
  activeStep: number;
}

export default function ProductFormStepper({
  steps,
  activeStep,
}: ProductFormStepperProps) {
  return (
    <div className="flex items-center justify-center">
      {steps.map((step, idx) => {
        const isActive = step.number === activeStep;
        const isPast = step.number < activeStep;
        const isLast = idx === steps.length - 1;

        return (
          <div key={step.number} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  isActive || isPast
                    ? "bg-[#00C9A7] text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {step.number}
              </div>
              <span
                className={`hidden text-sm font-medium sm:inline ${
                  isActive ? "text-slate-800" : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>

            {!isLast && (
              <div className="mx-3 h-0.5 w-12 sm:w-24 rounded-full transition-colors">
                <div
                  className={`h-full rounded-full ${
                    isPast ? "bg-[#00C9A7]" : "bg-slate-200"
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
