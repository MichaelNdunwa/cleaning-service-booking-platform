import Image from "next/image";

export default function AppleButton() {
    return (
        <button
            type="button"
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-neutral-200
        bg-white text-sm font-semibold text-neutral-700 shadow-sm
        hover:bg-neutral-50 hover:shadow-md transition-all duration-200
        active:scale-[0.98] focus-ring"
        >
            <Image src="/images/apple.svg" alt="Apple Logo" width={20} height={20} />
            Sign up with Apple
        </button>
    );
}
