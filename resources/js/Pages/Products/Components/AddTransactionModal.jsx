import InputLabel from '@/Components/InputLabel'
import Modal from '@/Components/Modal'
import PrimaryButton from '@/Components/PrimaryButton'
import SecondaryButton from '@/Components/SecondaryButton'
import Select from '@/Components/Select'
import TextInput from '@/Components/TextInput'
import { useForm } from '@inertiajs/react'
import { Autocomplete, Box, TextField, debounce } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'

export default function AddTransactionModal({open=false, onClose, isEdit=false, item}){
	const { data: itemForm, setData: setFormItem, post, processing } = useForm({
		product_id: null,
		product_name: null,
		station_id: null,
		station_name: null,
		amount: null,
		is_correction: 0
	})

	async function getProducts() {
		const { data } = await axios.get('http://127.0.0.1:4500/api/products', {
			params: {
				search: searchProduct
			}
		})
		setProducts(data.data)
	}

	async function getStations() {
		const { data } = await axios.get('http://127.0.0.1:4500/api/stations', {
			params: {
				search: searchStation
			}
		})
		setStations(data.data)
	}

	const [searchProduct, setSearchProduct] = useState()
	const [products, setProducts] = useState([])
	const [searchStation, setSearchStation] = useState()
	const [stations, setStations] = useState([])

	const handleSave = (e) => {
		if(isEdit){
			editProduct(e)
		} else {
			addProduct(e)
		}
	}

	const addProduct = (e) => {
		e.preventDefault()
		post(route('product_transactions.store'), {
			forceFormData: true,
			onSuccess: () => {
				onClose()
				get(route('product_transactions.index'))
			}
		})
	}

	const editProduct = (e) => {
		e.preventDefault()
		post(`/product_transactions/${itemForm.id}`, {
			onSuccess: () => {
				onClose()
				get(route('product_transactions.index'))
			}
		})
	}

	useEffect(()=> {
		getProducts()
	}, [searchProduct])

	useEffect(()=> {
		getStations()
	}, [searchStation])

	useEffect(() => {
		if(isEdit){
			setFormItem( {...item, '_method':'put'})
		} else {
			setFormItem(item)
		}
	}, [item])

	return(
		<Modal show={open} onClose={onClose}>
			<form className="p-6" onSubmit={handleSave}>
				<h2 className="text-lg font-medium text-gray-900 mb-4">
					{ isEdit ? 'Edit Stock' : 'Add Stock' }
				</h2>
				<div className="grid grid-cols-2 gap-3 gap-y-5">
					<div>
						<InputLabel htmlFor="product" value="Product" className="mb-1" />

						{
							!isEdit ? (
								<Autocomplete
									getOptionLabel={(products) =>
										typeof products === 'string' ? products : products.name
									}
									filterOptions={(x)=>x}
									options={!products ? [{name:'Loading...', id:0}] : products}
									inputValue={searchProduct}
									noOptionsText="No Products"
									onChange={(event, newValue) => {
										console.log(newValue.id)
										setFormItem('product_id', newValue.id)
									}}
									onInputChange={(event, newInputValue) => {
										setSearchProduct(newInputValue)
									}}
									renderInput={(params) => (
										<TextField {...params} placeholder="Add Product" fullWidth />
									)}
									renderOption={(props, products) => (
										<Box component='li' {...props} key={products.id}>
											{products.name}
										</Box>
									)}
								/>
							) : (
								<TextInput
									id="product"
									type="text"
									name="product"
									className="w-full"
									isFocused
									placeholder="Product"
									value={itemForm?.product_name}
									disabled
								/>
							)
						}
					</div>
					<div>
						<InputLabel htmlFor="station" value="Station" className="mb-1" />

						{
							!isEdit ? (
								<Autocomplete
									getOptionLabel={(stations) =>
										typeof stations === 'string' ? stations : stations.name
									}
									filterOptions={(x)=>x}
									options={!stations ? [{name:'Loading...', id:0}] : stations}
									inputValue={searchStation}
									noOptionsText="No Products"
									onChange={(event, newValue) => {
										setFormItem('station_id', newValue.id)
									}}
									onInputChange={(event, newInputValue) => {
										setSearchStation(newInputValue)
									}}
									renderInput={(params) => (
										<TextField {...params} placeholder="Add Station" fullWidth />
									)}
									renderOption={(props, stations) => (
										<Box component='li' {...props} key={stations.id}>
											{stations.name}
										</Box>
									)}
								/>
							) : (
								<TextInput
									id="station"
									type="text"
									name="station"
									className="w-full"
									isFocused
									placeholder="Station"
									value={itemForm?.station_name}
									disabled
								/>
							)
						}
					</div>
					<div>
						<InputLabel htmlFor="amount" value="Amount" className="mb-1" />

						<TextInput
							id="amount"
							type="number"
							name="amount"
							className="w-full"
							isFocused
							placeholder="Amount"
							value={itemForm?.amount}
							onChange={e=>setFormItem('amount', e.target.value)}
						/>
					</div>
					<div>
						<InputLabel htmlFor="isCorrection" value="Need Correction?" className="mb-1" />

						<Select
							className="w-full"
							value={itemForm?.is_correction}
							onChange={(e) => {
								setFormItem('is_correction', e.target.value)
							}}
						>
							<option value={0}>False</option>
							<option value={1}>True</option>
						</Select>
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