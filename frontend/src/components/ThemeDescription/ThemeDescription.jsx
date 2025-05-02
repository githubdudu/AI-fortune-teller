import { BannerUpsell, Box } from 'gestalt';

function ThemeDescription({theme}) {
  // This value is a dummy placeholder.
  const value =
    'Embrace your optimism and strive for fulfilment, but stay open to new experiences along your journey.';
  return (
    <>
      <div
        className="w-2xl overflow-hidden shadow-md"
        style={{ backgroundColor: '#FFFBEF' }}
      >
        <div className="px-3 py-2">
          <div className="flex items-center gap-5 px-4">
            <div className="w-2 h-2 rounded-full bg-orange-300 shrink-0 mb-12" />
            <div>
              <div className="text-[#261060] font-bold text-xl pt-2 mb-2">
                Theme label
              </div>
              <p className="text-[#261060] text-base overflow-hidden text-ellipsis line-clamp-3">
                {value}
              </p>
            </div>
          </div>
          <hr className="mt-4 border-gray-400 opacity-40" />
          <div className="px-6 pt-2 flex justify-between">
            <button
              onClick={() => console.log('Audio button is clicked')}
              className="flex items-center gap-1 text-sm font-semibold text-[#261060] hover:text-[#261060] focus:outline-none bg-transparent border-none p-0 cursor-pointer"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="size-4"
              >
                <path d="M7.557 2.066A.75.75 0 0 1 8 2.75v10.5a.75.75 0 0 1-1.248.56L3.59 11H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.59l3.162-2.81a.75.75 0 0 1 .805-.124ZM12.95 3.05a.75.75 0 1 0-1.06 1.06 5.5 5.5 0 0 1 0 7.78.75.75 0 1 0 1.06 1.06 7 7 0 0 0 0-9.9Z" />
                <path d="M10.828 5.172a.75.75 0 1 0-1.06 1.06 2.5 2.5 0 0 1 0 3.536.75.75 0 1 0 1.06 1.06 4 4 0 0 0 0-5.656Z" />
              </svg>
              Audio
            </button>
            <button
              onClick={() => console.log('Share button is clicked')}
              className="flex items-center gap-1 text-sm font-semibold text-[#261060] hover:text-[#261060] focus:outline-none bg-transparent border-none p-0 cursor-pointer"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="size-4"
              >
                <path d="M12 6a2 2 0 1 0-1.994-1.842L5.323 6.5a2 2 0 1 0 0 3l4.683 2.342a2 2 0 1 0 .67-1.342L5.995 8.158a2.03 2.03 0 0 0 0-.316L10.677 5.5c.353.311.816.5 1.323.5Z" />
              </svg>
              Share
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ThemeDescription;
