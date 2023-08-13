import { forwardRef, useEffect, useRef } from 'react'
import { twMerge } from 'tailwind-merge'

export default forwardRef(function TextInput(
	{ type = 'text', className = '', isFocused = false, ...props },
	ref
) {
	const input = ref ? ref : useRef()

	useEffect(() => {
		if (isFocused) {
			input.current.focus()
		}
	}, [])

	return (
		<input
			{...props}
			type={type}
			className={twMerge(
				'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm',
				className
			)}
			ref={input}
		/>
	)
})
