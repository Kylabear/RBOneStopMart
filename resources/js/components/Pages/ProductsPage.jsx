import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../UI/LoadingSpinner';
import ProductCard from '../UI/ProductCard';

const ProductsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [category, setCategory] = useState(searchParams.get('category') || '');
    const [sortBy, setSortBy] = useState(searchParams.get('sort_by') || 'created_at');
    const [sortOrder, setSortOrder] = useState(searchParams.get('sort_order') || 'desc');
    const [showFilters, setShowFilters] = useState(false);

    const { data: products, isLoading: productsLoading } = useQuery(
        ['products', searchParams.toString()],
        () => {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (category) params.append('category_slug', category);
            if (sortBy) params.append('sort_by', sortBy);
            if (sortOrder) params.append('sort_order', sortOrder);
            
            return axios.get(`/api/products?${params.toString()}`).then(res => res.data);
        }
    );

    const { data: categories, isLoading: categoriesLoading } = useQuery(
        'categories',
        () => axios.get('/api/categories').then(res => res.data)
    );

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (category) params.append('category', category);
        if (sortBy) params.append('sort_by', sortBy);
        if (sortOrder) params.append('sort_order', sortOrder);
        
        setSearchParams(params);
    };

    const handleCategoryChange = (newCategory) => {
        setCategory(newCategory);
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (newCategory) params.append('category', newCategory);
        if (sortBy) params.append('sort_by', sortBy);
        if (sortOrder) params.append('sort_order', sortOrder);
        
        setSearchParams(params);
    };

    const handleSortChange = (newSortBy, newSortOrder) => {
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (category) params.append('category', category);
        if (newSortBy) params.append('sort_by', newSortBy);
        if (newSortOrder) params.append('sort_order', newSortOrder);
        
        setSearchParams(params);
    };

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-4">Our Products</h1>
                    <p className="text-gray-300">Discover our wide range of products</p>
                </div>

                {/* Search and Filters */}
                <div className="glass-card rounded-2xl p-6 mb-8">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search products..."
                                className="w-full pl-10 pr-4 py-3 glass rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        
                        <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className="md:hidden flex items-center justify-center px-4 py-3 glass rounded-lg text-white hover:bg-white/10 transition-colors"
                        >
                            <FunnelIcon className="w-5 h-5 mr-2" />
                            Filters
                        </button>
                        
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                            Search
                        </button>
                    </form>

                    {/* Filters */}
                    <div className={`mt-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => handleCategoryChange(e.target.value)}
                                    className="w-full px-4 py-3 glass rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option value="">All Categories</option>
                                    {categories?.map((cat) => (
                                        <option key={cat.id} value={cat.slug}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Sort By */}
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">Sort By</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => handleSortChange(e.target.value, sortOrder)}
                                    className="w-full px-4 py-3 glass rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option value="created_at">Newest First</option>
                                    <option value="name">Name A-Z</option>
                                    <option value="price">Price</option>
                                </select>
                            </div>

                            {/* Sort Order */}
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">Order</label>
                                <select
                                    value={sortOrder}
                                    onChange={(e) => handleSortChange(sortBy, e.target.value)}
                                    className="w-full px-4 py-3 glass rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option value="desc">Descending</option>
                                    <option value="asc">Ascending</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                {productsLoading ? (
                    <div className="flex justify-center py-12">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <>
                        {products?.data?.length > 0 ? (
                            <>
                                <div className="mb-6">
                                    <p className="text-gray-300">
                                        Showing {products.data.length} of {products.total} products
                                    </p>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {products.data.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {products.last_page > 1 && (
                                    <div className="mt-8 flex justify-center">
                                        <div className="flex space-x-2">
                                            {Array.from({ length: products.last_page }, (_, i) => i + 1).map((page) => (
                                                <button
                                                    key={page}
                                                    onClick={() => {
                                                        const params = new URLSearchParams(searchParams);
                                                        params.set('page', page);
                                                        setSearchParams(params);
                                                    }}
                                                    className={`px-4 py-2 rounded-lg transition-colors ${
                                                        page === products.current_page
                                                            ? 'bg-blue-600 text-white'
                                                            : 'glass text-white hover:bg-white/10'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <div className="glass-card rounded-2xl p-8 max-w-md mx-auto">
                                    <h3 className="text-xl font-semibold text-white mb-4">No Products Found</h3>
                                    <p className="text-gray-300 mb-6">
                                        Try adjusting your search criteria or browse all products.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setSearch('');
                                            setCategory('');
                                            setSearchParams({});
                                        }}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;
