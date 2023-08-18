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
		material_id: null,
		material_name: null,
		station_id: null,
		station_name: null,
		amount: null,
		is_correction: 0
	})

	async function getMaterials() {
		const { data } = await axios.get('http://127.0.0.1:4500/api/materials', {
			params: {
				search: searchMaterial
			}
		})
		setMaterials(data.data)
	}

	async function getStations() {
		const { data } = await axios.get('http://127.0.0.1:4500/api/stations', {
			params: {
				search: searchStation
			}
		})
		setStations(data.data)
	}

	const [searchMaterial, setSearchMaterial] = useState()
	const [materials, setMaterials] = useState([])
	const [searchStation, setSearchStation] = useState()
	const [stations, setStations] = useState([])

	const handleSave = (e) => {
		if(isEdit){
			editMaterial(e)
		} else {
			addMaterial(e)
		}
	}

	const addMaterial = (e) => {
		e.preventDefault()
		post(route('material_transactions.store'), {
			forceFormData: true,
			onSuccess: () => {
				onClose()
				get(route('material_transactions.index'))
			}
		})
	}

	const editMaterial = (e) => {
		e.preventDefault()
		post(`/material_transactions/${itemForm?.id}`, {
			onSuccess: () => {
				onClose()
				get(route('material_transactions.index'))
			}
		})
	}

	useEffect(()=> {
		getMaterials()
	}, [searchMaterial])

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
						<InputLabel htmlFor="material" value="Material" className="mb-1" />
						{
							!isEdit ? (
								<Autocomplete
									getOptionLabel={(materials) =>
										typeof materials === 'string' ? materials : materials.name
									}
									filterOptions={(x)=>x}
									options={!materials ? [{name:'Loading...', id:0}] : materials}
									inputValue={searchMaterial}
									noOptionsText="No Materials"
									onChange={(event, newValue) => {
										console.log(newValue.id)
										setFormItem('material_id', newValue.id)
									}}
									onInputChange={(event, newInputValue) => {
										setSearchMaterial(newInputValue)
									}}
									renderInput={(params) => (
										<TextField {...params} placeholder="Add Material" fullWidth />
									)}
									renderOption={(props, materials) => (
										<Box component='li' {...props} key={materials.id}>
											{materials.name}
										</Box>
									)}
								/>
							) : (
								<TextInput
									id="material"
									type="text"
									name="material"
									className="w-full"
									isFocused
									placeholder="Material"
									value={itemForm?.material_name}
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
									noOptionsText="No Materials"
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