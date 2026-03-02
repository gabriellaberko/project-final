export const ErrorState = ({ text }: {text: string}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl">
        <h2 className="font-semibold mb-1">
          ⚠️ Error
        </h2>
        <p className="text-sm">{text ?? "Something went wrong. Please try again."}</p>
      </div>
    </div>
  );
};