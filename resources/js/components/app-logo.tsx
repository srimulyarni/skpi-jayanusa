import LogoUnjay from '@/assets/images/jayanusa.webp';
export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-white">
                <img
                    src={LogoUnjay}
                    alt="Jayanusa Logo"
                    className="size-6"
                />
            </div>
            <div className="ml-1 grid flex-1 text-left leading-tight">
                <span className="truncate text-xs font-semibold text-sidebar-foreground">
                   UNIVERSITAS JAYANUSA
                </span>
                <span className="truncate border-t border-sidebar-border pt-0.5 text-[10px] text-sidebar-foreground/70">
                    SISTEM SKPI JAYANUSA
                </span>
            </div>
        </>
    );
}