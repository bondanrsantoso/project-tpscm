import PrimaryButton from '@/Components/PrimaryButton'
import SecondaryButton from '@/Components/SecondaryButton'
import Select from '@/Components/Select'
import TextInput from '@/Components/TextInput'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, useForm, Link } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { FaPlus, FaRegPenToSquare, FaTrash } from 'react-icons/fa6'
import Modal from '@/Components/Modal'
import InputLabel from '@/Components/InputLabel'
import TextArea from '@/Components/TextArea'
import AddStationModal from './Components/AddStationModal'

function StationsList({
	items,
	auth,
	search,
	order_by,
	page,
	paginate,
	...props
}) {
	const { data, setData, get, delete: deleteStation } = useForm({
		search,
		order_by,
		page,
		paginate,
	})

	const {get: getItemDetail } = useForm()

	const [isEdit, setIsEdit] = useState(false)
	const [openModal, setOpenModal] = useState(false)
	const [selectedItem, setSelectedItem] =useState()
	const INITIAL_FORM_DATA = {
		name: null,
		description: null,
		address: null,
		type: 'warehouse',
		lat: null,
		lng: null,
	}

	function refresh() {
		get(route('stations.index'))
	}

	const openEditModal = (item) => {
		setIsEdit(true)
		setSelectedItem(item)
		setOpenModal(true)
	}

	const openAddModal = () => {
		setIsEdit(false)
		setSelectedItem(INITIAL_FORM_DATA)
		setOpenModal(true)
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
						<option value="type;asc">
                            Type ASC
						</option>
						<option value="type;desc">
							Type DESC
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
								<td className="p-2 border text-blue-600 underline"><button onClick={()=>getItemDetail(route('stations.show', [item.id]))}>{item.name}</button></td>
								<td className="p-2 border">{item.description}</td>
								<td className="p-2 border">{item.address}</td>
								<td className="p-2 border">{item.type}</td>
								<td className="p-2 border">{item.lat.toString()}</td>
								<td className="p-2 border">{item.lng.toString()}</td>
								<td className="p-2 border">
									<div className="flex justify-center gap-2">
										<button onClick={()=>openEditModal(item)}>
											<FaRegPenToSquare/>
										</button>
										<button onClick={()=>deleteStation(route('products.destroy', item.id))}>
											<FaTrash/>
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
				<AddStationModal open={openModal} onClose={()=>setOpenModal(false)} isEdit={isEdit} item={selectedItem} />
			</div>
		</AuthenticatedLayout>
	)
}

export default StationsList
