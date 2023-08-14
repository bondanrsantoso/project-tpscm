import PrimaryButton from '@/Components/PrimaryButton'
import SecondaryButton from '@/Components/SecondaryButton'
import Select from '@/Components/Select'
import TextInput from '@/Components/TextInput'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, useForm, Link } from '@inertiajs/react'
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

function StationsList({
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
		name: null,
		description: null,
		address: null,
		type: null,
		lat: null,
		lng: null,
	})

	function refresh() {
		get(route('stations.index'))
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
		post(route('stations.store'), {
			forceFormData: true,
			onSuccess: () => {
				closeModal()
				get(route('stations.index'))
			}
		})
	}

	const editProduct = (e) => {
		e.preventDefault()
		patch(`/stations/${itemForm.id}`, {
			onSuccess: () => {
				closeModal()
				get(route('stations.index'))
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

	// useEffect(() => {
	// 	setFormItem('gross_weight', parseFloat(itemForm.net_weight) + parseFloat(itemForm.tare_weight))
	// }, [itemForm.net_weight, itemForm.tare_weight])

	return (
		<AuthenticatedLayout
			header={<h2 className="text-lg font-bold">Stations</h2>}
			user={auth.user}
		>
			<Head title="Items"></Head>
			<div className="max-w-7xl mx-auto py-10">
				<div className="flex flex-row justify-between">
					<h1 className="text-xl font-bold">Stations List</h1>
					<PrimaryButton className="shrink-0 bg-blue-900 hover:bg-blue-800 focus:bg-blue-800 active:bg-blue-950" onClick={openAddModal}>
						<FaPlus className="mr-2"/> Add Stations
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
                        Search Stations
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
							<th className="p-2 border">Name</th>
							<th className="p-2 border">Description</th>
							<th className="p-2 border">Address</th>
							<th className="p-2 border">Type</th>
							<th className="p-2 border">Lat</th>
							<th className="p-2 border">Long</th>
							<th className="p-2 border">Actions</th>
						</tr>
					</thead>
					<tbody>
						{items.data.map((item) => (
							<tr key={item.id}>
								<td className="p-2 border">{item.name}</td>
								<td className="p-2 border">{item.description}</td>
								<td className="p-2 border">{item.address}</td>
								<td className="p-2 border">{item.type}</td>
								<td className="p-2 border">{item.lat.toString()}</td>
								<td className="p-2 border">{item.lng.toString()}</td>
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
							{ isEdit ? 'Edit Stations' : 'Add Stations' }
						</h2>

						<div className="grid grid-cols-2 gap-3 gap-y-5">
							<div>
								<InputLabel htmlFor="name" value="Name" className="mb-1" />

								<TextInput
									id="name"
									type="text"
									name="name"
									className="w-full"
									isFocused
									placeholder="Name"
									value={itemForm.name}
									onChange={e=>setFormItem('name', e.target.value)}
								/>
							</div>
							<div>
								<InputLabel htmlFor="type" value="Type" className="mb-1" />

								<Select
									className="w-full"
									value={itemForm.type}
									onChange={(e) => {
										setFormItem('type', e.target.value)
									}}
								>
									<option value="warehouse">Warehouse</option>
									<option value="plant">Plant</option>
								</Select>
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
							<div className="col-span-2">
								<InputLabel htmlFor="address" value="Address" className="mb-1" />

								<TextArea
									id="address"
									type="text"
									name="address"
									className="w-full"
									isFocused
									placeholder="Address"
									value={itemForm.address}
									onChange={e=>setFormItem('address', e.target.value)}
								/>
							</div>
							<div>
								<InputLabel htmlFor="lat" value="Lat" className="mb-1" />

								<TextInput
									id="lat"
									type="text"
									name="lat"
									className="w-full"
									isFocused
									placeholder="Lat"
									value={itemForm.lat}
									onChange={e=>setFormItem('lat', e.target.value)}
								/>
							</div>
							<div>
								<InputLabel htmlFor="long" value="Long" className="mb-1" />

								<TextInput
									id="long"
									type="text"
									name="long"
									className="w-full"
									isFocused
									placeholder="Long"
									value={itemForm.lng}
									onChange={e=>setFormItem('lng', e.target.value)}
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

export default StationsList
