export function Loader() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        <div className="w-10 h-10 border-4 border-blue-200 rounded-full" />
        <div className="absolute top-0 left-0 w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
}
