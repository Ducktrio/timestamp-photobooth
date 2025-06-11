interface StepperProps {
  stage: number;
  className?: string;
}
export default function Stepper({ stage, className = '' }: StepperProps) {
  return (
    <>
      <div className={`flex flex-col px-8 gap-4 ${className}`}>
        <div className="relative flex flex-col items-center">
          <div
            className={`w-12 h-12 bg-black text-white flex items-center justify-center rounded-full text-lg font-bold`}
          >
            1
          </div>
          <div className="mt-2 font-semibold">Layout</div>
          <div
            className={`h-10 w-px ${
              stage < 2 ? 'bg-gray-300' : 'bg-black'
            } mt-2`}
          ></div>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            <div
              className={`w-12 h-12 ${
                stage < 2 ? 'bg-gray-300' : 'bg-black'
              } text-white flex items-center justify-center rounded-full text-lg font-bold`}
            >
              2
            </div>
          </div>
          <div
            className={`mt-2 font-semibold ${stage < 2 ? 'text-gray-400' : ''}`}
          >
            Frame
          </div>
          <div
            className={`h-10 w-px ${
              stage < 3 ? 'bg-gray-300' : 'bg-black'
            } mt-2`}
          ></div>
        </div>

        <div className="flex flex-col items-center">
          <div
            className={`w-12 h-12 ${
              stage < 3 ? 'bg-gray-300' : 'bg-black'
            } text-white flex items-center justify-center rounded-full text-lg font-bold`}
          >
            3
          </div>
          <div
            className={`mt-2 font-semibold ${stage < 3 ? 'text-gray-400' : ''}`}
          >
            Filter
          </div>
        </div>
      </div>
    </>
  );
}
