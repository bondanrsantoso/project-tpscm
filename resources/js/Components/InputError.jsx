import { twMerge } from 'tailwind-merge'

export default function InputError({ message, className = '', ...props }) {
	return message ? (
		<p {...props} className={twMerge('text-sm text-red-600', className)}>
			{message}
		</p>
	) : null
}
