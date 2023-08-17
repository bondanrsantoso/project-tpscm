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

function ProductDetail({
	item,
	auth,
	id,
	...props
}) {

	const [openModal, setOpenModal] = useState(false)

	return (
		<AuthenticatedLayout
			header={<h2 className="text-lg font-bold">Product Detail</h2>}
			user={auth.user}
		>
			<Head title="Product Detail"></Head>
			<pre className="max-w-7xl mx-auto py-10">
				{/* <div className='flex flex-row justify-end'>
					<PrimaryButton className="shrink-0 bg-blue-900 hover:bg-blue-800 focus:bg-blue-800 active:bg-blue-950" onClick={() => setOpenModal(true)}>
						<FaRegPenToSquare className="mr-2"/> Edit Product
					</PrimaryButton>
				</div>
				<div className='flex flex-col items-center mx-10'>
					<h3 className="text-lg font-bold">{item.name}</h3>
					<img src={item.image_url} alt={item.name} className='w-52 h-52 py-4'/>
					<div className='grid grid-cols-3 w-full gap-3'>
						<div className='flex flex-row gap-2 justify-center'>
							<h3 className="text-md font-bold">SKU:</h3>
							<h3 className="text-md">{item.sku}</h3>
						</div>
						<div className='flex flex-row gap-2 justify-center'>
							<h3 className="text-md font-bold">Brand:</h3>
							<h3 className="text-md">{item.brand}</h3>
						</div>
						<div className='flex flex-row gap-2 justify-center'>
							<h3 className="text-md font-bold">Variant:</h3>
							<h3 className="text-md">{item.variants}</h3>
						</div>
						<div className='flex flex-row gap-2 justify-center'>
							<h3 className="text-md font-bold">Net Weight:</h3>
							<h3 className="text-md">{item.net_weight} gr</h3>
						</div>
						<div className='flex flex-row gap-2 justify-center'>
							<h3 className="text-md font-bold">Gross Weight:</h3>
							<h3 className="text-md">{item.gross_weight} gr</h3>
						</div>
						<div className='flex flex-row gap-2 justify-center'>
							<h3 className="text-md font-bold">Tare Weight:</h3>
							<h3 className="text-md">{item.tare_weight} gr</h3>
						</div>
						<div className='flex flex-row gap-2 justify-center'>
							<h3 className="text-md font-bold">Width:</h3>
							<h3 className="text-md">{item.width} mm</h3>
						</div>
						<div className='flex flex-row gap-2 justify-center'>
							<h3 className="text-md font-bold">Height:</h3>
							<h3 className="text-md">{item.height} mm</h3>
						</div>
						<div className='flex flex-row gap-2 justify-center'>
							<h3 className="text-md font-bold">Depth:</h3>
							<h3 className="text-md">{item.depth} mm</h3>
						</div>
						<div className='flex flex-row gap-2 justify-center'>
							<h3 className="text-md font-bold">Volume:</h3>
							<h3 className="text-md">{item.volume} mm</h3>
						</div>
						<div className='flex flex-row gap-2 justify-center'>
							<h3 className="text-md font-bold">Base Value:</h3>
							<h3 className="text-md">{formatIDR(item.base_value)}</h3>
						</div>
						<div className='flex flex-row gap-2 justify-center'>
							<h3 className="text-md font-bold">Stock Unit:</h3>
							<h3 className="text-md">{item.stock_unit}</h3>
						</div>
					</div>
					<div className='flex flex-row gap-4 justify-center w-full mt-10'>
						<div>
							<h3 className="text-md font-bold text-center">Stocks Table</h3>
							<table className="table-auto mt-2 w-full">
								<thead>
									<tr>
										<th className="p-2 border-2">Station Name</th>
										<th className="p-2 border-2">Station Type</th>
										<th className="p-2 border-2">Stock Amount</th>
									</tr>
								</thead>
								<tbody>
									{item.stocks.map((item) => (
										<tr key={item.id}>
											<td className="p-2 border-2">{item.station.name}</td>
											<td className="p-2 border-2">{item.station.type}</td>
											<td className="p-2 border-2 text-right">{item.amount}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<div>
							<h3 className="text-md font-bold text-center">Transactions Table</h3>
							<table className="table-auto mt-2 w-full">
								<thead>
									<tr>
										<th className="p-2 border-2">Station Name</th>
										<th className="p-2 border-2">Station Type</th>
										<th className="p-2 border-2">Transaction Type</th>
										<th className="p-2 border-2">Transaction Amount</th>
									</tr>
								</thead>
								<tbody>
									{item.transactions.map((item) => (
										<tr key={item.id}>
											<td className="p-2 border-2">{item.station.name}</td>
											<td className="p-2 border-2">{item.station.type}</td>
											<td className="p-2 border-2">{item.type}</td>
											<td className="p-2 border-2 text-right">{item.amount}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div> */}
				{JSON.stringify(items, null, 2)}
				<AddStationModal open={openModal} onClose={()=>setOpenModal(false)} isEdit="true" item={item}/>
			</pre>
		</AuthenticatedLayout>
	)
}

export default ProductDetail
