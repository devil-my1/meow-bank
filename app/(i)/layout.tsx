import MobileNav from "@/components/MobileNav"
import Sidebar from "@/components/Sidebar"
import Image from "next/image"
import { redirect } from "next/navigation"

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	const loggedInUser = {
		firstName: "Amir",
		lastName: "ProgFa"
	}
	if (!loggedInUser) redirect("/sign-in")
	return (
		<main className='flex h-screen w-full font-ibm-plex-serif'>
			<Sidebar user={loggedInUser} />
			<div className='flex size-full flex-col'>
				<div className='root-layout'>
					<Image
						src='/icons/logo.svg'
						width={30}
						height={30}
						alt='logo'
					/>
					<div>
						<MobileNav user={loggedInUser} />
					</div>
				</div>
				{children}
			</div>
		</main>
	)
}
