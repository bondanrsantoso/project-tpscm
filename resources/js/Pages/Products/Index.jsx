import PrimaryButton from '@/Components/PrimaryButton'
import SecondaryButton from '@/Components/SecondaryButton'
import Select from '@/Components/Select'
import TextInput from '@/Components/TextInput'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, useForm } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { FaPlus, FaRegPenToSquare } from 'react-icons/fa6'
import Modal from '@/Components/Modal'
import InputLabel from '@/Components/InputLabel'
import TextArea from '@/Components/TextArea'

function formatIDR(amount) {
	const formatter = new Intl.NumberFormat('id', {
		currency: 'IDR',
		style: 'currency',
	})
	return formatter.format(amount)
}

function ProductsList({
	items,
	auth,
	search,
	order_by,
	page,
	paginate,
	...props
}) {
	const { data, setData, get } = useForm({
		search,
		order_by,
		page,
		paginate,
	})

	const [needRefresh, setNeedRefresh] = useState(false)
	const [showAddModal, setShowAddModal] = useState(false)
	const [isEdit, setIsEdit] = useState(false)
	const { data: itemForm, setData: setFormItem, post, patch, put, processing } = useForm({
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

	function refresh() {
		get(route('products.index'))
	}

	const openAddModal = () => {
		setShowAddModal(true)
		setIsEdit(false)
	}

	const openEditModal = (item) => {
		delete item['image_url']
		setFormItem(item)
		setShowAddModal(true)
		setIsEdit(true)
	}

	const closeModal = () => {
		setShowAddModal(false)
	}

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
				closeModal()
				get(route('products.index'))
			}
		})
	}

	const editProduct = (e) => {
		e.preventDefault()
		patch(`/products/${itemForm.id}`, {
			onSuccess: () => {
				closeModal()
				get(route('products.index'))
			}
		})
	}

	useEffect(() => {
		if (data.order_by !== order_by || data.paginate !== paginate) {
			if (page !== 1) {
				// Implicit refresh by reset to page 1
				setData('page', 1)
			} else {
				refresh()
			}
		}
	}, [data.paginate, data.order_by])

	useEffect(() => {
		if (data.page !== page) {
			refresh()
		}
	}, [data.page])

	useEffect(() => {
		setFormItem('gross_weight', parseFloat(itemForm.net_weight) + parseFloat(itemForm.tare_weight))
	}, [itemForm.net_weight, itemForm.tare_weight])

	return (
		<AuthenticatedLayout
			header={<h2 className="text-lg font-bold">Products</h2>}
			user={auth.user}
		>
			<Head title="Items"></Head>
			<div className="max-w-7xl mx-auto py-10">
				<div className="flex flex-row justify-between">
					<h1 className="text-xl font-bold">Products List</h1>
					<PrimaryButton className="shrink-0 bg-blue-900 hover:bg-blue-800 focus:bg-blue-800 active:bg-blue-950" onClick={openAddModal}>
						<FaPlus className="mr-2"/> Add Product
					</PrimaryButton>
				</div>
				<form
					className="mt-4 flex justify-end items-center gap-2"
					onSubmit={(e) => {
						e.preventDefault()
						if (page !== 1) {
							setData('page', 1)
							// refresh() will be called implicitly when a change in
							// data.page is detected so it doesn't have to be called
							// here
						} else {
							refresh()
						}
					}}
				>
					<Select
						value={data.order_by}
						onChange={(e) => {
							setData('order_by', e.target.value)
						}}
					>
						<option value="name;asc">Name A-Z</option>
						<option value="name;desc">Name Z-A</option>
						<option value="updated_at;desc">Latest</option>
						<option value="updated_at;asc">Oldest</option>
						<option value="gross_weight;asc">
                            Weight: Lightest first
						</option>
						<option value="gross_weight;desc">
                            Weight: Heaviest first
						</option>
					</Select>
					<div className="border rounded-md flex flex-row items-baseline w-full bg-white">
						<i className="bi-search mx-2"></i>
						<TextInput
							value={data.search || ''}
							className="border-0 w-full bg-transparent"
							onChange={(e) => {
								setData('search', e.target.value)
							}}
							placeholder="Search Here"
						/>
					</div>
					<PrimaryButton type="submit" className="shrink-0">
                        Search Products
					</PrimaryButton>
				</form>

				<div className="flex gap-3 items-baseline my-3">
					<div className="flex items-baseline gap-3">
						<span>Showing</span>
						<Select
							value={data.paginate}
							onChange={(e) => {
								setData('paginate', e.target.value)
							}}
						>
							{[10, 25, 50, 100].map((amount) => (
								<option value={amount}>{amount}</option>
							))}
						</Select>
						<span>items per page</span>
					</div>
					<div className="flex items-baseline gap-3 ml-auto">
						{page > 1 && (
							<SecondaryButton
								onClick={(e) => {
									setData('page', page - 1)
								}}
							>
								<i className="bi-chevron-left"></i>
							</SecondaryButton>
						)}
						<span>Page</span>
						<Select
							value={page}
							onChange={(e) => {
								setData('page', e.target.value)
							}}
						>
							{Array(items.last_page)
								.fill(0)
								.map((_, i) => (
									<option value={i + 1}>{i + 1}</option>
								))}
						</Select>
						<span>of {items.last_page}</span>
						{page < items.last_page && (
							<SecondaryButton
								onClick={(e) => {
									setData('page', page - 0 + 1)
								}}
							>
								<i className="bi-chevron-right"></i>
							</SecondaryButton>
						)}
					</div>
				</div>
				<table className="table-auto mt-2 w-full">
					<thead>
						<tr>
							<th className="p-2 border">SKU</th>
							<th className="p-2 border">Image</th>
							<th className="p-2 border">Name</th>
							<th className="p-2 border">Brand</th>
							<th className="p-2 border">Variants</th>
							<th className="p-2 border">Dimensions</th>
							<th className="p-2 border">Weight</th>
							<th className="p-2 border">Value</th>
							<th className="p-2 border">Stock Unit</th>
							<th className="p-2 border">Actions</th>
						</tr>
					</thead>
					<tbody>
						{items.data.map((item) => (
							<tr key={item.id}>
								<td className="p-2 border">{item.sku}</td>
								<td className="p-2 border">
									<img
										src={item.image_url}
										alt={item.name}
										className="w-20 max-h-20 mx-auto"
									/>
								</td>
								<td className="p-2 border">{item.name}</td>
								<td className="p-2 border">{item.brand}</td>
								<td className="p-2 border">{item.variants}</td>
								<td className="p-2 border">
									{item.width}mm &times; {item.height}mm
                                    &times; {item.depth}mm
								</td>
								<td className="p-2 border">
									<div className='flex flex-col'>
										<p>Gross: {item.gross_weight} gr</p>
										<p>Nett: {item.net_weight} gr</p>
										<p>Tare: {item.tare_weight} gr</p>
									</div>
								</td>
								<td className="p-2 border">
									{formatIDR(item.base_value)}
								</td>
								<td className="p-2 border">{item.stock_unit}</td>
								<td className="p-2 border">
									<div className="flex justify-center">
										<button onClick={()=>openEditModal(item)}>
											<FaRegPenToSquare/>
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				<div className="flex gap-3 items-baseline my-3">
					<div className="flex items-baseline gap-3">
						<span>Showing</span>
						<Select
							value={data.paginate}
							onChange={(e) => {
								setData('paginate', e.target.value)
							}}
						>
							{[10, 25, 50, 100].map((amount) => (
								<option value={amount}>{amount}</option>
							))}
						</Select>
						<span>items per page</span>
					</div>
					<div className="flex items-baseline gap-3 ml-auto">
						{page > 1 && (
							<SecondaryButton
								onClick={(e) => {
									setData('page', page - 1)
								}}
							>
								<i className="bi-chevron-left"></i>
							</SecondaryButton>
						)}
						<span>Page</span>
						<Select
							value={page}
							onChange={(e) => {
								setData('page', e.target.value)
							}}
						>
							{Array(items.last_page)
								.fill(0)
								.map((_, i) => (
									<option value={i + 1}>{i + 1}</option>
								))}
						</Select>
						<span>of {items.last_page}</span>
						{page < items.last_page && (
							<SecondaryButton
								onClick={(e) => {
									setData('page', page - 0 + 1)
								}}
							>
								<i className="bi-chevron-right"></i>
							</SecondaryButton>
						)}
					</div>
				</div>

				{/* <pre>{JSON.stringify(items, null, 2)}</pre> */}
				<Modal show={showAddModal} onClose={closeModal}>
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
							<SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
							<PrimaryButton className="ml-3" type="submit" disabled={processing}>Save</PrimaryButton>
						</div>
					</form>
				</Modal>
			</div>
		</AuthenticatedLayout>
	)
}

export default ProductsList
