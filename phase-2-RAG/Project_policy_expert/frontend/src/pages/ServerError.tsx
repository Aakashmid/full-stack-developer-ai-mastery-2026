import React from "react";

const ServerError: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg font-manrope text-textPrimary">
      <div className="max-w-md rounded-lg border border-accent bg-surface p-8 text-center shadow-lg">
        <h1 className="text-3xl font-bold text-primary">500 - Server Error</h1>
        <p className="mt-4 text-textSecondary">
          Something went wrong on our end. Please try again later.
        </p>
        <button
          className="mt-6 rounded-md bg-primary px-6 py-2 font-semibold text-textPrimary transition hover:bg-accent"
          onClick={() => (window.location.href = "/")}
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default ServerError;
