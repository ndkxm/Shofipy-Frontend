import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { ProductCard } from "../shared/ProductCard";
import { fetchCategories, fetchGenres } from "../../store/actions";
import { Loader } from "../shared/Loader";
import { Filter } from "./Filter";
import { useProductFilter } from "../hooks/useProductFilter";
import { Paginations } from "../shared/Paginations";
import { Header } from "../shared/Header";
import { Footer } from "../shared/Footer";
import { Reveal, SplitReveal } from "../shared/Motion";

export const Products = () => {
    const { isFetchingProducts, fetchingProductsErrorMessage } = useSelector((state) => state.errors);
    const { products, categories, genres, paginations } = useSelector((state) => state.products);
    const dispatch = useDispatch();
    useProductFilter();

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchGenres());
    }, [dispatch]);

    return (
        <div className="bg-slate-50 min-h-screen">
            <Header />

            <main className="pt-16">
                <section className="border-b border-slate-900">
                    <div className="max-w-7xl mx-auto px-5 md:px-6 pt-12 pb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                        <div>
                            <p className="label-mono text-slate-500 mb-3">Catalogue</p>
                            <SplitReveal lines={["All games"]} className="display text-6xl md:text-8xl text-slate-900" />
                        </div>
                        {paginations?.totalElements > 0 && (
                            <p className="font-mono text-sm text-slate-600 tabular-nums">
                                {paginations.totalElements} titles
                            </p>
                        )}
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-5 md:px-6 py-8">
                    <Filter categories={categories} genres={genres} />

                    {isFetchingProducts ? (
                        <Loader text="Loading games" />
                    ) : fetchingProductsErrorMessage ? (
                        <div className="panel max-w-md mx-auto my-20 p-8 text-center" role="alert">
                            <AlertTriangle className="mx-auto text-blue-600 mb-3" size={24} aria-hidden="true" />
                            <h2 className="text-lg font-bold text-slate-900">Couldn’t load games</h2>
                            <p className="mt-1 mb-6 text-sm text-slate-500">{fetchingProductsErrorMessage}</p>
                            <button onClick={() => window.location.reload()} className="btn-ink">
                                <RotateCcw size={14} aria-hidden="true" /> Try again
                            </button>
                        </div>
                    ) : products?.length === 0 ? (
                        <div className="py-24 text-center">
                            <p className="text-2xl font-extrabold text-slate-900">Nothing matches that.</p>
                            <p className="mt-2 text-slate-500">Try a different keyword or clear the filters.</p>
                        </div>
                    ) : (
                        <>
                            <div className="pt-8 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                                {products?.map((item, i) => (
                                    <Reveal key={item.productId} delay={(i % 4) * 0.06} y={20} className="h-full"><ProductCard {...item} index={i} /></Reveal>
                                ))}
                            </div>
                            <div className="pt-14 flex justify-center">
                                <Paginations
                                    numberOfPage={paginations?.totalPages}
                                    totalProducts={paginations?.totalElements}
                                />
                            </div>
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};
