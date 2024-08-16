// import { LucidePlus } from 'lucide-react'

export function EmptyTasks() {
  return (
    <div className="flex flex-col items-center justify-center mx-auto text-center max-w-7xl">
      <svg
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="w-12 h-12 mx-auto text-foreground"
      >
        <path
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <h3 className="mt-2 text-sm font-semibold text-foreground">No tasks</h3>
      <p className="mt-1 text-sm text-foreground">Get started by creating a new task.</p>
      {/* <div className="mt-6">
        <button
          type="button"
          className="inline-flex items-center px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <LucidePlus aria-hidden="true" className="-ml-0.5 mr-1.5 h-5 w-5" />
          New Project
        </button>
      </div> */}
    </div>
  )
}
