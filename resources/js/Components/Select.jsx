import { forwardRef, useEffect, useRef } from 'react'
import { twMerge } from 'tailwind-merge'

export default forwardRef(function TextInput(
	{ className = '', isFocused = false, children, ...props },
	ref
) {
	const input = ref ? ref : useRef()

	useEffect(() => {
		if (isFocused) {
			input.current.focus()
		}
	}, [])

	return (
		<select
			{...props}
			className={twMerge(
				'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm',
				className
			)}
			ref={input}
		>
			{children}
		</select>
	)
})
