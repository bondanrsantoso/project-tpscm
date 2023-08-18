import PrimaryButton from '@/Components/PrimaryButton'
import SecondaryButton from '@/Components/SecondaryButton'
import Select from '@/Components/Select'
import TextInput from '@/Components/TextInput'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, useForm, Link } from '@inertiajs/react'
import { useEffect, useState, useMemo } from 'react'
import { FaPlus, FaRegPenToSquare, FaTrash } from 'react-icons/fa6'
import Modal from '@/Components/Modal'
import InputLabel from '@/Components/InputLabel'
import TextArea from '@/Components/TextArea'
import AddStationModal from './Components/AddStationModal'

function formatIDR(amount) {
	const formatter = new Intl.NumberFormat('id', {
		currency: 'IDR',
		style: 'currency',
	})
	return formatter.format(amount)
}

function StationDetail({
	item,
	auth,
	id,
	...props
}) {

	const [openModal, setOpenModal] = useState(false)
	const [selectedItem, setSelectedItem] =useState()
	const [itemPerPage, setItemPerPage] = useState(5)
	const [productPage, setProductPage] = useState(1)
	const [materialPage, setMaterialPage] = useState(1)
	const [productTransactionPage, setProductTransactionPage] = useState(1)
	const [materialTransactionPage, setMaterialTransactionPage] = useState(1)

	const pageCalculation = (length) => {
		return Math.ceil(length / itemPerPage)
	}

	const productLastPage = useMemo(() => pageCalculation(item ? item.products.length : 0), [item.products])
	const materialLastPage = useMemo(() => pageCalculation(item ? item.materials.length : 0), [item.materials])
	const productTransactionLastPage = useMemo(() => pageCalculation(item ? item.product_transactions.length : 0), [item.product_transactions])
	const materialTransactionLastPage = useMemo(() => pageCalculation(item ? item.material_transactions.length : 0), [item.material_transactions])

	useEffect(()=>{
		if(item){
			setSelectedItem(item)
		}
	},[item])

	return (
		<AuthenticatedLayout
			header={<h2 className="text-lg font-bold">Station Detail</h2>}
			user={auth.user}
		>
			<Head title="Product Detail"></Head>
			<pre className="max-w-7xl mx-auto py-10">
				<div className='flex flex-row justify-end'>
					<PrimaryButton className="shrink-0 bg-blue-900 hover:bg-blue-800 focus:bg-blue-800 active:bg-blue-950" onClick={() => setOpenModal(true)}>
						<FaRegPenToSquare className="mr-2"/> Edit Product
					</PrimaryButton>
				</div>
				<div className='flex flex-col items-center mx-10'>
					<h3 className="text-lg font-bold my-4">{item.name}</h3>
					<div className='flex flex-col w-full gap-3'>
						<div className='flex flex-row gap-2 justify-start text'>
							<h3 className="text-md font-bold">Description:</h3>
							<h3 className="text-md line-clamp-1">{item.description}</h3>
						</div>
						<div className='flex flex-row gap-2 justify-start'>
							<h3 className="text-md font-bold">Address:</h3>
							<h3 className="text-md">{item.address}</h3>
						</div>
						<div className='flex flex-row gap-2 justify-start'>
							<h3 className="text-md font-bold">Lat:</h3>
							<h3 className="text-md">{item.lat}</h3>
						</div>
						<div className='flex flex-row gap-2 justify-start'>
							<h3 className="text-md font-bold">Long:</h3>
							<h3 className="text-md">{item.lng} gr</h3>
						</div>
					</div>
					<div className='grid grid-cols-2 gap-4 justify-center w-full mt-10'>
						<div>
							<h3 className="text-md font-bold text-center">Products</h3>
							<table className="table-auto mt-2 w-full">
								<thead>
									<tr>
										<th className="p-2 border-2">Product SKU</th>
										<th className="p-2 border-2">Product Name</th>
										<th className="p-2 border-2">Stock</th>
										<th className="p-2 border-2">Unit</th>
									</tr>
								</thead>
								<tbody>
									{item.products.slice((productPage-1)*itemPerPage, productPage*itemPerPage).map((item) => (
										<tr key={item.id}>
											<td className="p-2 border-2">{item.sku}</td>
											<td className="p-2 border-2">{item.name}</td>
											<td className="p-2 border-2 text-right">{item.stock.amount}</td>
											<td className="p-2 border-2">{item.stock_unit}</td>
										</tr>
									))}
								</tbody>
							</table>
							<div className="flex items-baseline gap-3 ml-auto justify-center">
								{productPage > 1 && (
									<SecondaryButton
										onClick={(e) => {
											setProductPage((v)=>v-1)
										}}
									>
										<i className="bi-chevron-left"></i>
									</SecondaryButton>
								)}
								<span>Page</span>
								<Select
									value={productPage}
									onChange={(e) => {
										setProductPage(e.target.value)
									}}
								>
									{Array(productLastPage)
										.fill(0)
										.map((_, i) => (
											<option value={i + 1}>{i + 1}</option>
										))}
								</Select>
								<span>of {productLastPage}</span>
								{productPage < productLastPage && (
									<SecondaryButton
										onClick={(e) => {
											setProductPage((v)=>v - 0 + 1)
										}}
									>
										<i className="bi-chevron-right"></i>
									</SecondaryButton>
								)}
							</div>
						</div>
						<div>
							<h3 className="text-md font-bold text-center">Materials</h3>
							<table className="table-auto mt-2 w-full">
								<thead>
									<tr>
										<th className="p-2 border-2">Material SKU</th>
										<th className="p-2 border-2">Material Name</th>
										<th className="p-2 border-2">Stock</th>
										<th className="p-2 border-2">Unit</th>
									</tr>
								</thead>
								<tbody>
									{item.materials.slice((materialPage-1)*itemPerPage, materialPage*itemPerPage).map((item) => (
										<tr key={item.id}>
											<td className="p-2 border-2">{item.sku}</td>
											<td className="p-2 border-2">{item.name}</td>
											<td className="p-2 border-2 text-right">{item.stock.amount}</td>
											<td className="p-2 border-2">{item.stock_unit}</td>
										</tr>
									))}
								</tbody>
							</table>
							<div className="flex items-baseline gap-3 ml-auto justify-center">
								{materialPage > 1 && (
									<SecondaryButton
										onClick={(e) => {
											setMaterialPage((v)=>v-1)
										}}
									>
										<i className="bi-chevron-left"></i>
									</SecondaryButton>
								)}
								<span>Page</span>
								<Select
									value={materialPage}
									onChange={(e) => {
										setMaterialPage(e.target.value)
									}}
								>
									{Array(materialLastPage)
										.fill(0)
										.map((_, i) => (
											<option value={i + 1}>{i + 1}</option>
										))}
								</Select>
								<span>of {materialLastPage}</span>
								{productPage < materialLastPage && (
									<SecondaryButton
										onClick={(e) => {
											setMaterialPage((v)=>v - 0 + 1)
										}}
									>
										<i className="bi-chevron-right"></i>
									</SecondaryButton>
								)}
							</div>
						</div>
						<div>
							<h3 className="text-md font-bold text-center">Product Transactions</h3>
							<table className="table-auto mt-2 w-full">
								<thead>
									<tr>
										<th className="p-2 border-2">Type</th>
										<th className="p-2 border-2">Product SKU</th>
										<th className="p-2 border-2">Product Name</th>
										<th className="p-2 border-2">Amount</th>
										<th className="p-2 border-2">Unit</th>
									</tr>
								</thead>
								<tbody>
									{item.product_transactions.slice((productTransactionPage-1)*itemPerPage, productTransactionPage*itemPerPage).map((item) => (
										<tr key={item.id}>
											<td className="p-2 border-2">{item.type}</td>
											<td className="p-2 border-2">{item.product.sku}</td>
											<td className="p-2 border-2">{item.product.name}</td>
											<td className="p-2 border-2 text-right">{item.amount}</td>
											<td className="p-2 border-2">{item.product.stock_unit}</td>
										</tr>
									))}
								</tbody>
							</table>
							<div className="flex items-baseline gap-3 ml-auto justify-center">
								{productTransactionPage > 1 && (
									<SecondaryButton
										onClick={(e) => {
											setProductTransactionPage((v)=>v-1)
										}}
									>
										<i className="bi-chevron-left"></i>
									</SecondaryButton>
								)}
								<span>Page</span>
								<Select
									value={productTransactionPage}
									onChange={(e) => {
										setProductTransactionPage(e.target.value)
									}}
								>
									{Array(productTransactionLastPage)
										.fill(0)
										.map((_, i) => (
											<option value={i + 1}>{i + 1}</option>
										))}
								</Select>
								<span>of {productTransactionLastPage}</span>
								{productTransactionPage < productTransactionLastPage && (
									<SecondaryButton
										onClick={(e) => {
											setProductTransactionPage((v)=>v - 0 + 1)
										}}
									>
										<i className="bi-chevron-right"></i>
									</SecondaryButton>
								)}
							</div>
						</div>
						<div>
							<h3 className="text-md font-bold text-center">Material Transactions</h3>
							<table className="table-auto mt-2 w-full">
								<thead>
									<tr>
										<th className="p-2 border-2">Type</th>
										<th className="p-2 border-2">Material SKU</th>
										<th className="p-2 border-2">Material Name</th>
										<th className="p-2 border-2">Amount</th>
										<th className="p-2 border-2">Unit</th>
									</tr>
								</thead>
								<tbody>
									{item.material_transactions.slice((materialTransactionPage-1) * itemPerPage, materialTransactionPage * itemPerPage).map((item) => (
										<tr key={item.id}>
											<td className="p-2 border-2">{item.type}</td>
											<td className="p-2 border-2">{item.material.sku}</td>
											<td className="p-2 border-2">{item.material.name}</td>
											<td className="p-2 border-2 text-right">{item.amount}</td>
											<td className="p-2 border-2">{item.material.stock_unit}</td>
										</tr>
									))}
								</tbody>
							</table>
							<div className="flex items-baseline gap-3 ml-auto justify-center">
								{materialTransactionPage > 1 && (
									<SecondaryButton
										onClick={(e) => {
											setMaterialTransactionPage((v)=>v-1)
										}}
									>
										<i className="bi-chevron-left"></i>
									</SecondaryButton>
								)}
								<span>Page</span>
								<Select
									value={materialTransactionPage}
									onChange={(e) => {
										setMaterialTransactionPage(e.target.value)
									}}
								>
									{Array(materialTransactionLastPage)
										.fill(0)
										.map((_, i) => (
											<option value={i + 1}>{i + 1}</option>
										))}
								</Select>
								<span>of {materialTransactionLastPage}</span>
								{materialTransactionPage < materialTransactionLastPage && (
									<SecondaryButton
										onClick={(e) => {
											setMaterialTransactionPage((v)=>v - 0 + 1)
										}}
									>
										<i className="bi-chevron-right"></i>
									</SecondaryButton>
								)}
							</div>
						</div>
					</div>
				</div>
				<AddStationModal open={openModal} onClose={()=>setOpenModal(false)} isEdit="true" item={selectedItem}/>
				{/* <pre>{JSON.stringify(item, null, 2)}</pre> */}

			</pre>
		</AuthenticatedLayout>
	)
}

export default StationDetail
