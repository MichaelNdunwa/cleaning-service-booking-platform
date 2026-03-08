export default function BookingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
            {children}
        </div>
    );
}
