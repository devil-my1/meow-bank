"use client"
import { signOut } from "@/lib/actions/user.action"
import Image from "next/image"
import { redirect, useRouter } from "next/navigation"
import React from "react"

const Footer = ({ user, type = "desktop" }: FooterProps) => {
	const router = useRouter()
	const handleLogOut = async () => {
		const loggedOut = await signOut()

		if (loggedOut) router.push("/sign-in")
	}

	return (
		<footer className='footer'>
			<div
				className={type === "desktop" ? "footer_name" : "footer_name-mobile"}
			>
				<p className='text-xl font-bold text-gray-500'>{user?.firstName[0]}</p>
			</div>
			<div
				className={type === "desktop" ? "footer_email" : "footer_email-mobile"}
			>
				<h2 className='text-14 truncate font-semibold text-gray-700'>{`${user?.lastName} ${user?.firstName}`}</h2>
				<p className='text-14 truncate font-normal text-gray-600'>
					{user?.email}
				</p>
			</div>
			<div
				className='footer_image'
				onClick={handleLogOut}
			>
				<Image
					src='/icons/logout.svg'
					fill
					alt='logout'
				/>
			</div>
		</footer>
	)
}

export default Footer
