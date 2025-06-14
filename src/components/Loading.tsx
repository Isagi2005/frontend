const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent"></div>
      </div>
    </div>
  );
};

export default Loading;
