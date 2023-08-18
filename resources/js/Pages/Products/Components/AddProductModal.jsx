import InputLabel from '@/Components/InputLabel'
import Modal from '@/Components/Modal'
import PrimaryButton from '@/Components/PrimaryButton'
import SecondaryButton from '@/Components/SecondaryButton'
import TextArea from '@/Components/TextArea'
import TextInput from '@/Components/TextInput'
import { useForm } from '@inertiajs/react'
import { useEffect } from 'react'

export default function AddProductModal({open=false, onClose, isEdit=false, item}){
	const { data: itemForm, setData: setFormItem, post, patch, processing } = useForm({
		sku: null,
		brand: null,
		variants: null,
		description: null,
		image: null,
		net_weight: null,
		gross_weight: null,
		tare_weight: null,
		width: null,
		height: null,
		depth: null,
		base_value: null,
		stock_unit: null
	})

	const handleSave = (e) => {
		if(isEdit){
			editProduct(e)
		} else {
			addProduct(e)
		}
	}

	const addProduct = (e) => {
		e.preventDefault()
		post(route('products.store'), {
			forceFormData: true,
			onSuccess: () => {
				onClose()
				get(route('products.index'))
			}
		})
	}

	const editProduct = (e) => {
		e.preventDefault()
		post(`/products/${itemForm.id}`, {
			onSuccess: () => {
				onClose()
				get(route('products.index'))
			}
		})
	}

	useEffect(() => {
		if(isEdit){
			setFormItem( {...item, '_method':'put'})
		} else {
			setFormItem(item)
		}
	}, [item])

	useEffect(() => {
		setFormItem('gross_weight', parseFloat(itemForm.net_weight) + parseFloat(itemForm.tare_weight))
	}, [itemForm.net_weight, itemForm.tare_weight])

	return(
		<Modal show={open} onClose={onClose}>
			<form className="p-6" onSubmit={handleSave}>
				<h2 className="text-lg font-medium text-gray-900 mb-4">
					{ isEdit ? 'Edit Item' : 'Add Item' }
				</h2>
				<div className="grid grid-cols-2 gap-3 gap-y-5">
					<div className='col-span-2'>
						<InputLabel htmlFor="sku" value="SKU" className="mb-1" />

						<TextInput
							id="sku"
							type="text"
							name="sku"
							className="w-full"
							isFocused
							placeholder="SKU"
							value={itemForm.sku}
							onChange={e=>setFormItem('sku', e.target.value)}
						/>
					</div>
					<div>
						<InputLabel htmlFor="brand" value="Brand" className="mb-1" />

						<TextInput
							id="brand"
							type="text"
							name="brand"
							className="w-full"
							isFocused
							placeholder="Brand"
							value={itemForm.brand}
							onChange={e=>setFormItem('brand', e.target.value)}
						/>
					</div>
					<div>
						<InputLabel htmlFor="variant" value="Variant" className="mb-1" />

						<TextInput
							id="variant"
							type="text"
							name="variant"
							className="w-full"
							isFocused
							placeholder="Variant"
							value={itemForm.variants}
							onChange={e=>setFormItem('variants', e.target.value)}
						/>
					</div>
					<div>
						<InputLabel htmlFor="value" value="Value" className="mb-1" />

						<TextInput
							id="value"
							type="number"
							name="value"
							className="w-full"
							isFocused
							placeholder="Value"
							value={itemForm.base_value}
							onChange={e=>setFormItem('base_value', e.target.value)}
						/>
					</div>
					<div>
						<InputLabel htmlFor="stock_unit" value="Stock Unit" className="mb-1" />

						<TextInput
							id="stock_unit"
							type="text"
							name="stock_unit"
							className="w-full"
							isFocused
							placeholder="Stock Unit"
							value={itemForm.stock_unit}
							onChange={e=>setFormItem('stock_unit', e.target.value)}
						/>
					</div>
					<div className="col-span-2">
						<InputLabel htmlFor="weight" value="Weight (gr)" className="mb-1" />

						<div
							id="weight"
							name="weight"
							className="flex flex-row gap-2"
						>
							<TextInput
								type="number"
								className="w-full"
								isFocused
								placeholder="Nett Weight"
								value={itemForm.net_weight}
								onChange={e=>setFormItem('net_weight', e.target.value)}
							/>
							<TextInput
								type="number"
								className="w-full"
								isFocused
								placeholder="Tare Weight"
								value={itemForm.tare_weight}
								onChange={e=>setFormItem('tare_weight', e.target.value)}
							/>
							<TextInput
								type="number"
								className="w-full"
								isFocused
								placeholder="Gross Weight"
								value={itemForm.gross_weight}
								disabled
							/>
						</div>
					</div>
					<div className="col-span-2">
						<InputLabel htmlFor="dimensions" value="Dimensions (mm)" className="mb-1" />

						<div
							id="dimensions"
							name="dimensions"
							className="flex flex-row gap-2"
						>
							<TextInput
								type="number"
								className="w-full"
								isFocused
								placeholder="Width"
								value={itemForm.width}
								onChange={e=>setFormItem('width', e.target.value)}
							/>
							<TextInput
								type="number"
								className="w-full"
								isFocused
								placeholder="Height"
								value={itemForm.height}
								onChange={e=>setFormItem('height', e.target.value)}
							/>
							<TextInput
								type="number"
								className="w-full"
								isFocused
								placeholder="Depth"
								value={itemForm.depth}
								onChange={e=>setFormItem('depth', e.target.value)}
							/>
						</div>
					</div>
					<div className="col-span-2">
						<InputLabel htmlFor="image" value="Image Url" className="mb-1" />

						<TextInput
							id="image"
							type="file"
							accept="image/png, image/gif, image/jpeg"
							name="image"
							className="w-full"
							isFocused
							placeholder="Image Url"
							onChange={e=>setFormItem('image', e.target.files[0])}
						/>
					</div>
					<div className="col-span-2">
						<InputLabel htmlFor="description" value="Description" className="mb-1" />

						<TextArea
							id="description"
							type="text"
							name="description"
							className="w-full"
							isFocused
							placeholder="Description"
							value={itemForm.description}
							onChange={e=>setFormItem('description', e.target.value)}
						/>
					</div>
				</div>

				<div className="mt-6 flex justify-end">
					<SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
					<PrimaryButton className="ml-3" type="submit" disabled={processing}>Save</PrimaryButton>
				</div>
			</form>
		</Modal>
	)
}