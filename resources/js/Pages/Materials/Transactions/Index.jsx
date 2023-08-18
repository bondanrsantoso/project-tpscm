import PrimaryButton from '@/Components/PrimaryButton'
import SecondaryButton from '@/Components/SecondaryButton'
import Select from '@/Components/Select'
import TextInput from '@/Components/TextInput'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, useForm } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { FaPlus, FaRegPenToSquare } from 'react-icons/fa6'
import AddTransactionModal from '../Components/AddTransactionModal'


function formatIDR(amount) {
	const formatter = new Intl.NumberFormat('id', {
		currency: 'IDR',
		style: 'currency',
	})
	return formatter.format(amount)
}

function MaterialTransactionsList({
	items,
	auth,
	search,
	order_by,
	page,
	paginate,
	...props
}) {
	const { data, setData, get, delete: deleteStock } = useForm({
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
		material_id: null,
		material_name: null,
		station_id: null,
		station_name: null,
		amount: null,
		is_correction: 0
	}

	function refresh() {
		get(route('material_transactions.index'))
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
			header={<h2 className="text-lg font-bold">Materials</h2>}
			user={auth.user}
		>
			<Head title="Material Items"></Head>
			<div className="max-w-7xl mx-auto py-10">
				<div className="flex flex-row justify-between">
					<h1 className="text-xl font-bold">Materials Transactions List</h1>
					<PrimaryButton className="shrink-0 bg-blue-900 hover:bg-blue-800 focus:bg-blue-800 active:bg-blue-950" onClick={openAddModal}>
						<FaPlus className="mr-2"/> Add Transaction
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
						<option value="material_name;asc">Name A-Z</option>
						<option value="material_name;desc">Name Z-A</option>
						<option value="updated_at;desc">Latest</option>
						<option value="updated_at;asc">Oldest</option>
						<option value="amount;desc">
                            Amount: Most First
						</option>
						<option value="amount;asc">
							Amount: Fewest First
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
                        Search Transactions
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
							<th className="p-2 border">Material Name</th>
							<th className="p-2 border">Station Name</th>
							<th className="p-2 border">Type</th>
							<th className="p-2 border">Amount</th>
							<th className="p-2 border">Unit</th>
							<th className="p-2 border">Need Correction</th>
							<th className="p-2 border">Actions</th>
						</tr>
					</thead>
					<tbody>
						{items.data.map((item) => (
							<tr key={item.id}>
								<td className="p-2 border text-blue-600 underline"><button onClick={()=>getItemDetail(route('materials.show', [item.material_id]))}>{item.material_name}</button></td>
								<td className="p-2 border text-blue-600 underline"><button onClick={()=>getItemDetail(route('stations.show', [item.station_id]))}>{item.station_name}</button></td>
								<td className="p-2 border">{item.type}</td>
								<td className="p-2 border text-end">{item.amount}</td>
								<td className="p-2 border">{item.unit}</td>
								<td className="p-2 border">{item.is_correction ? 'YES' : 'NO'}</td>
								<td className="p-2 border">
									<button onClick={()=>openEditModal(item)}>
										<FaRegPenToSquare/>
									</button>
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
				<AddTransactionModal open={openModal} onClose={()=>setOpenModal(false)} isEdit={isEdit} item={selectedItem}/>
			</div>
		</AuthenticatedLayout>
	)
}

export default MaterialTransactionsList
