import InputLabel from '@/Components/InputLabel'
import Modal from '@/Components/Modal'
import PrimaryButton from '@/Components/PrimaryButton'
import SecondaryButton from '@/Components/SecondaryButton'
import TextArea from '@/Components/TextArea'
import TextInput from '@/Components/TextInput'
import { useEffect } from 'react'
import { useForm } from '@inertiajs/react'
import Select from '@/Components/Select'

export default function AddStationModal({open=false, onClose, isEdit=false, item}){
	const { data: itemForm, setData: setFormItem, post, processing, get } = useForm({
		name: null,
		description: null,
		address: null,
		type: 'warehouse',
		lat: null,
		lng: null,
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
		post(route('stations.store'), {
			forceFormData: true,
			onSuccess: () => {
				onClose()
				get(route('stations.index'))
			}
		})
	}

	const editProduct = (e) => {
		e.preventDefault()
		post(`/stations/${itemForm.id}`, {
			onSuccess: () => {
				onClose()
				get(route('stations.index'))
			}
		})
	}

	useEffect(() => {
		if(item){
			if(isEdit){
				setFormItem( {...item, '_method':'put'})
			} else {
				setFormItem(item)
			}
		}
	}, [item])

	return(
		<Modal show={open} onClose={onClose}>
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
					<SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
					<PrimaryButton className="ml-3" type="submit" disabled={processing}>Save</PrimaryButton>
				</div>
			</form>
		</Modal>
	)
}