"use client"
import React, { useCallback, useEffect, useState } from "react"
import { Button } from "./ui/button"
import {
	PlaidLinkOnSuccess,
	PlaidLinkOptions,
	usePlaidLink
} from "react-plaid-link"
import { createLinkToken, exchangeToken } from "@/lib/actions/user.action"
import { useRouter } from "next/navigation"
import Image from "next/image"

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
	const router = useRouter()
	const [token, setToken] = useState("")

	useEffect(() => {
		const getLinkToken = async () => {
			const response = await createLinkToken(user)
			setToken(response?.linkToken)
		}
		getLinkToken()
	}, [user])

	const onSuccess = useCallback<PlaidLinkOnSuccess>(
		async (public_token: string) => {
			await exchangeToken({ publicToken: public_token, user })
			router.push("/")
		},
		[user]
	)
	const config: PlaidLinkOptions = {
		token,
		onSuccess
	}

	const { open, ready } = usePlaidLink(config)

	return (
		<>
			{variant === "primary" ? (
				<Button
					onClick={() => open()}
					disabled={!ready}
					className='plaidlink-primary'
				>
					Connect bank
				</Button>
			) : variant === "ghost" ? (
				<Button
					onClick={() => open()}
					disabled={!ready}
					className='plaidlink-ghost'
				>
					<Image
						src='/icons/connect-bank.svg'
						width={24}
						height={24}
						alt='plaid'
					/>
					<p className='text-[16px] font-semibold text-black-2 hidden xl:block'>
						Connect bank
					</p>
				</Button>
			) : (
				<Button
					onClick={() => open()}
					disabled={!ready}
					className='plaidlink-default'
				>
					<Image
						src='/icons/connect-bank.svg'
						width={24}
						height={24}
						alt='plaid'
					/>
					<p className='text-[16px] font-semibold text-black-2'>Connect bank</p>
				</Button>
			)}
		</>
	)
}

export default PlaidLink
