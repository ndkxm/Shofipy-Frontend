import { } from "@headlessui/react";
import { useEffect, useState } from "react";
import { FiArrowUp, FiRefreshCcw, FiSearch } from "react-icons/fi";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
export const Filter = ({ categories }) => {

    const [searchParams] = useSearchParams();
    const params = new URLSearchParams(searchParams);
    const pathname = useLocation().pathname;
    const navigate = useNavigate();

    const [category, setCategory] = useState("all");
    const [sortOrder, setSortOrder] = useState("asc");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const currentCategory = searchParams.get("category") || "all";
        const currentSortOrder = searchParams.get("sortOrder") || "asc";
        const currentSearchTerm = searchParams.get("keyword") || "";

        setCategory(currentCategory);
        setSortOrder(currentSortOrder);
        setSearchTerm(currentSearchTerm);

    }, [searchParams]);

    useEffect(() => {
        const handler = setTimeout(() => {

            if (searchTerm) {
                searchParams.set("keyword", searchTerm);
            } else {
                searchParams.delete("keyword");
            }

            navigate(`${pathname}?${searchParams.toString()}`);

        }, 600);

        return () => clearTimeout(handler);

    }, [searchParams, searchTerm, navigate, pathname]);

    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;

        if (selectedCategory === "all") {
            params.delete("category");
        } else {
            params.set("category", selectedCategory);
        }

        navigate(`${pathname}?${params}`);
        setCategory(selectedCategory);
    };

    const toggleSortOrder = (e) => {
        const newOrder = e.target.value;
        params.set("sortOrder", newOrder);
        navigate(`${pathname}?${params}`);
        setSortOrder(newOrder);
    };

    const handleClearFilter = () => {
        navigate({ pathname });
    };

    return (
        <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 mb-10">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                {/* Search */}
                <div className="relative w-full lg:max-w-md">

                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="
                        w-full
                        border
                        border-gray-300
                        rounded-full
                        py-2.5
                        pl-11
                        pr-4
                        text-sm
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500
                        transition
                        "
                    />

                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4">

                    <FormControl size="small" className="min-w-[180px]">
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={category}
                            onChange={handleCategoryChange}
                            label="Category"
                        >

                            <MenuItem value="all">All</MenuItem>

                            {
                                categories?.map((item) => (
                                    <MenuItem
                                        key={item.categoryId}
                                        value={item.categoryName}
                                    >
                                        {item.categoryName}
                                    </MenuItem>
                                ))
                            }

                        </Select>
                    </FormControl>

                    <FormControl size="small" className="min-w-[160px]">
                        <InputLabel>Sort Price</InputLabel>

                        <Select
                            value={sortOrder}
                            onChange={toggleSortOrder}
                            label="Sort Price"
                        >
                            <MenuItem value="asc">Low → High</MenuItem>
                            <MenuItem value="desc">High → Low</MenuItem>
                        </Select>

                    </FormControl>

                    {/* Clear filter */}
                    <button
                        onClick={handleClearFilter}
                        className="
                        flex items-center gap-2
                        px-4 py-2
                        bg-gray-100
                        hover:bg-gray-200
                        text-gray-700
                        rounded-full
                        text-sm
                        transition
                        "
                    >

                        <FiRefreshCcw />
                        Clear

                    </button>

                </div>

            </div>

        </div>
    );
};