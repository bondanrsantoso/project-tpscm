import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import Select from "@/Components/Select";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";

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

    function refresh() {
        get(route("items.index"));
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
                <h1 className="text-xl font-bold">Items List</h1>
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
            </div>
        </AuthenticatedLayout>
    );
}

export default ItemsList;
