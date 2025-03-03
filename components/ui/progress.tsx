"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef(function Progress(
	props: React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
		indicatorClassName?: string
	},
	ref: React.Ref<React.ComponentRef<typeof ProgressPrimitive.Root>>
) {
	const { className, value, indicatorClassName, ...rest } = props
	return (
		<ProgressPrimitive.Root
			ref={ref}
			className={cn(
				"relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
				className
			)}
			{...rest}
		>
			<ProgressPrimitive.Indicator
				className={cn(
					"h-full w-full flex-1 bg-primary transition-all",
					indicatorClassName
				)}
				style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
			/>
		</ProgressPrimitive.Root>
	)
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
