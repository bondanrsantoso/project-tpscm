import { twMerge } from 'tailwind-merge'

export default function InputLabel({
	value,
	className = '',
	children,
	...props
}) {
	return (
		<label
			{...props}
			className={twMerge(
				'block font-medium text-sm text-gray-700',
				className
			)}
		>
			{value ? value : children}
		</label>
	)
}
