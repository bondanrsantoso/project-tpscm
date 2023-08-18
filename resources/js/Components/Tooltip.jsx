import { twMerge } from 'tailwind-merge'

export default function Tooltip({
	className = '',
	children,
	...props
}) {
	return (
		<a
			{...props}
			href='#'
			className={twMerge(
				'transititext-primary text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600 ',
				className
			)}
		>
			{children}
		</a>
	)
}
