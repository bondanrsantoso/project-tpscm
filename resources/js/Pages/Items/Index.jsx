import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import Select from "@/Components/Select";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { FaPlus, FaRegPenToSquare } from "react-icons/fa6";
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextArea from "@/Components/TextArea";

function formatIDR(amount) {
    const formatter = new Intl.NumberFormat("id", {
        currency: "IDR",
        style: "currency",
    });
    return formatter.format(amount);
}

function ItemsList({
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
    });

    const [needRefresh, setNeedRefresh] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [itemForm, setFormItem] = useState({
        name: null,
        image_url: null,
        width: null,
        height: null,
        weight: null,
        depth: null,
        value: null,
        description: null
    })

    function refresh() {
        get(route("items.index"));
    }

    const openAddModal = () => {
        setShowAddModal(true)
        setIsEdit(false)
    }

    const openEditModal = (item) => {
        setFormItem(item)
        setShowAddModal(true)
        setIsEdit(true)

        console.log('====================================');
        console.log(item);
        console.log('====================================');
    }

    const closeModal = () => {
        setShowAddModal(false)
    }

    useEffect(() => {
        if (data.order_by !== order_by || data.paginate !== paginate) {
            if (page !== 1) {
                // Implicit refresh by reset to page 1
                setData("page", 1);
            } else {
                refresh();
            }
        }
    }, [data.paginate, data.order_by]);

    useEffect(() => {
        if (data.page !== page) {
            refresh();
        }
    }, [data.page]);

    return (
        <AuthenticatedLayout
            header={<h2 className="text-lg font-bold">Items</h2>}
            user={auth.user}
        >
            <Head title="Items"></Head>
            <div className="max-w-7xl mx-auto py-10">
                <div className="flex flex-row justify-between">
                    <h1 className="text-xl font-bold">Items List</h1>
                     <PrimaryButton className="shrink-0 bg-blue-900 hover:bg-blue-800 focus:bg-blue-800 active:bg-blue-950" onClick={openAddModal}>
                        <FaPlus className="mr-2"/> Add Items
                     </PrimaryButton>
                </div>
                <form
                    className="mt-4 flex justify-end items-center gap-2"
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (page !== 1) {
                            setData("page", 1);
                            // refresh() will be called implicitly when a change in
                            // data.page is detected so it doesn't have to be called
                            // here
                        } else {
                            refresh();
                        }
                    }}
                >
                    <Select
                        value={data.order_by}
                        onChange={(e) => {
                            setData("order_by", e.target.value);
                        }}
                    >
                        <option value="name;asc">Name A-Z</option>
                        <option value="name;desc">Name Z-A</option>
                        <option value="updated_at;desc">Latest</option>
                        <option value="updated_at;asc">Oldest</option>
                        <option value="weight;asc">
                            Weight: Lightest first
                        </option>
                        <option value="weight;desc">
                            Weight: Heaviest first
                        </option>
                    </Select>
                    <div className="border rounded-md flex flex-row items-baseline w-full bg-white">
                        <i className="bi-search mx-2"></i>
                        <TextInput
                            value={data.search || ""}
                            className="border-0 w-full bg-transparent"
                            onChange={(e) => {
                                setData("search", e.target.value);
                            }}
                            placeholder="Search Here"
                        />
                    </div>
                    <PrimaryButton type="submit" className="shrink-0">
                        Search Items
                    </PrimaryButton>
                </form>

                <div className="flex gap-3 items-baseline my-3">
                    <div className="flex items-baseline gap-3">
                        <span>Showing</span>
                        <Select
                            value={data.paginate}
                            onChange={(e) => {
                                setData("paginate", e.target.value);
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
                                    setData("page", page - 1);
                                }}
                            >
                                <i className="bi-chevron-left"></i>
                            </SecondaryButton>
                        )}
                        <span>Page</span>
                        <Select
                            value={page}
                            onChange={(e) => {
                                setData("page", e.target.value);
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
                                    setData("page", page - 0 + 1);
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
                            <th className="p-2 border">Image</th>
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Weight</th>
                            <th className="p-2 border">Dimensions</th>
                            <th className="p-2 border">Value</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.data.map((item) => (
                            <tr key={item.id}>
                                <td className="p-2 border">
                                    <img
                                        src={item.image_url}
                                        alt={item.name}
                                        className="w-20 max-h-20 mx-auto"
                                    />
                                </td>
                                <td className="p-2 border">{item.name}</td>
                                <td className="p-2 border">{item.weight} kg</td>
                                <td className="p-2 border">
                                    {item.width}cm &times; {item.height}cm
                                    &times; {item.depth}cm
                                </td>
                                <td className="p-2 border">
                                    {formatIDR(item.value)}
                                </td>
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
                                setData("paginate", e.target.value);
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
                                    setData("page", page - 1);
                                }}
                            >
                                <i className="bi-chevron-left"></i>
                            </SecondaryButton>
                        )}
                        <span>Page</span>
                        <Select
                            value={page}
                            onChange={(e) => {
                                setData("page", e.target.value);
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
                                    setData("page", page - 0 + 1);
                                }}
                            >
                                <i className="bi-chevron-right"></i>
                            </SecondaryButton>
                        )}
                    </div>
                </div>

                {/* <pre>{JSON.stringify(items, null, 2)}</pre> */}
                <Modal show={showAddModal} onClose={closeModal}>
                    <form className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">
                            { isEdit ? 'Edit Item' : 'Add Item' }
                        </h2>

                        <div class="grid grid-cols-2 gap-3 gap-y-5">
                            <div>
                                <InputLabel htmlFor="name" value="Item Name" className="mb-1" />

                                <TextInput
                                    id="name"
                                    type="text"
                                    name="name"
                                    className="w-full"
                                    isFocused
                                    placeholder="Item Name"
                                    value={itemForm.name}
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="weight" value="Item Weight" className="mb-1" />

                                <TextInput
                                    id="weight"
                                    type="number"
                                    name="weight"
                                    className="w-full"
                                    isFocused
                                    placeholder="Item Weight"
                                    value={itemForm.weight}
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="width" value="Item Width" className="mb-1" />

                                <TextInput
                                    id="width"
                                    type="number"
                                    name="width"
                                    className="w-full"
                                    isFocused
                                    placeholder="Item Width"
                                    value={itemForm.width}
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="height" value="Item Height" className="mb-1" />

                                <TextInput
                                    id="height"
                                    type="number"
                                    name="height"
                                    className="w-full"
                                    isFocused
                                    placeholder="Item Height"
                                    value={itemForm.height}
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="depth" value="Item Depth" className="mb-1" />

                                <TextInput
                                    id="depth"
                                    type="number"
                                    name="depth"
                                    className="w-full"
                                    isFocused
                                    placeholder="Item Depth"
                                    value={itemForm.depth}
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="value" value="Item Value" className="mb-1" />

                                <TextInput
                                    id="value"
                                    type="number"
                                    name="value"
                                    className="w-full"
                                    isFocused
                                    placeholder="Item Value"
                                    value={itemForm.value}
                                />
                            </div>
                            <div className="col-span-2">
                                <InputLabel htmlFor="image" value="Image Url" className="mb-1" />

                                <TextInput
                                    id="image"
                                    type="text"
                                    name="image"
                                    className="w-full"
                                    isFocused
                                    placeholder="Image Url"
                                    value={itemForm.image_url}
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
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
                            <PrimaryButton className="ml-3" onClick={closeModal}>Save</PrimaryButton>
                        </div>
                    </form>
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}

export default ItemsList;
