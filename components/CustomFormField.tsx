"use client"
import React, { useState } from "react"
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage
} from "./ui/form"
import { Input } from "./ui/input"
import { Control, FieldPath } from "react-hook-form"

import { z } from "zod"
import { baseSchemaForm } from "../lib/utils"
import { ArrowRightIcon, Calendar } from "lucide-react"
import DatePicker from "react-datepicker"

import "react-datepicker/dist/react-datepicker.css"
import { Button } from "./ui/button"
interface CustomFormFieldProps {
	control: Control<z.infer<typeof baseSchemaForm>>
	name: FieldPath<z.infer<typeof baseSchemaForm>>
	label: string
	placeholder: string
}

const CustomFormField = ({
	control,
	name,
	label,
	placeholder
}: CustomFormFieldProps) => {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<div className='form-item'>
						<FormLabel className='form-label'>{label}</FormLabel>
						<div className='flex w-full flex-col'>
							{name === "dateOfBirth" ? (
								<div className='date-picker rounded-md flex border h-9 items-center'>
									<Calendar
										size={24}
										className='mr-2 text-gray-400'
									/>
									<FormControl>
										<DatePicker
											selected={new Date(field.value ?? "")}
											onChange={date => field.onChange(date)}
											className='outline-none w-full'
											renderCustomHeader={({
												date,
												changeYear,
												decreaseMonth,
												increaseMonth,
												prevMonthButtonDisabled,
												nextMonthButtonDisabled
											}) => (
												<div className='flex justify-between items-center p-2 bg-black-2 text-white rounded-md'>
													<Button
														variant={"ghost"}
														onClick={decreaseMonth}
														disabled={prevMonthButtonDisabled}
														className='focus:outline-none  hover:text-black'
													>
														<ArrowRightIcon
															size={16}
															transform='rotate(180)'
														/>
													</Button>
													<div className='flex items-center'>
														<span className='mr-2 t'>
															{date.toLocaleString("default", {
																month: "long"
															})}
														</span>
														<select
															value={date.getFullYear()}
															onChange={({ target: { value } }) =>
																changeYear(Number(value))
															}
															className='outline-none bg-transparent text-white'
														>
															{Array.from({ length: 150 }, (_, i) => (
																<option
																	className='text-gray-700'
																	key={i}
																	value={1950 + i}
																>
																	{1950 + i}
																</option>
															))}
														</select>
													</div>
													<Button
														variant={"ghost"}
														onClick={increaseMonth}
														disabled={nextMonthButtonDisabled}
														className='focus:outline-none  hover:text-black'
													>
														<ArrowRightIcon size={16} />
													</Button>
												</div>
											)}
										/>
									</FormControl>
								</div>
							) : (
								<FormControl>
									<Input
										type={name === "password" ? "password" : "text"}
										placeholder={placeholder}
										className='input-class'
										{...field}
										value={field.value as string}
									/>
								</FormControl>
							)}

							<FormMessage className='form-message mt-2' />
						</div>
					</div>
				</FormItem>
			)}
		/>
	)
}

export default CustomFormField
