"use client";

export default function HeaderPage() {
  return (
    <div className="text-center">
      <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
        Generus Mengaji V3
      </h1>
      <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
        Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem
        cupidatat commodo. Elit sunt amet fugiat veniam occaecat.
      </p>
      <p>created by Alif Musthofa</p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <a
          href="dashboard"
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Dashboard
        </a>
      </div>
    </div>
  );
}
