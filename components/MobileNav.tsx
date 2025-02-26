"use client"
import React from "react"
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTitle,
	SheetTrigger
} from "@/components/ui/sheet"
import { MenuIcon } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { sidebarLinks } from "@/constants"
import Footer from "./Footer"

const MobileNav = ({ user }: MobileNavProps) => {
	const pathname = usePathname()
	return (
		<section className='w-full max-w-[264px]'>
			<Sheet>
				<SheetTrigger>
					<MenuIcon
						className='cursor-pointer'
						size={30}
					/>
				</SheetTrigger>
				<SheetContent
					side={"left"}
					className='border-none bg-white'
				>
					<SheetTitle />
					<Link
						href='/'
						className='cursor-pointer items-center gap-1 px-4 flex'
					>
						<Image
							src='/icons/logo.svg'
							width={32}
							height={32}
							alt='logo'
						/>
						<h2 className='text-26 font-inter font-bold text-black-1'>
							MeowBank
						</h2>
					</Link>
					<div className='mobilenav-sheet'>
						<SheetClose asChild>
							<nav className=' flex h-full flex-col gap-6 pt-16 text-white'>
								{sidebarLinks.map(link => {
									const isActive =
										pathname === link.route ||
										pathname.startsWith(`${link.route}/`)
									return (
										<SheetClose
											key={link.label}
											asChild
										>
											<Link
												href={link.route}
												className={cn("mobilenav-sheet_close w-full", {
													"bg-bank-gradient": isActive
												})}
											>
												<Image
													src={link.imgURL}
													width={20}
													height={20}
													alt={link.label}
													className={cn({
														"brightness-[3] invert-0": isActive
													})}
												/>

												<p
													className={cn("text-16 font-semibold text-black-2", {
														"!text-white": isActive
													})}
												>
													{link.label}
												</p>
											</Link>
										</SheetClose>
									)
								})}
								USER
							</nav>
						</SheetClose>
						<Footer
							user={user}
							type='mobile'
						/>
					</div>
				</SheetContent>
			</Sheet>
		</section>
	)
}

export default MobileNav
