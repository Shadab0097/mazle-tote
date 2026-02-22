'use client';

import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts as fetchAllProducts } from '@/store/productSlice';
import api from '@/services/api';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSearch, FiImage, FiPackage, FiFilter, FiMoreHorizontal, FiUploadCloud } from 'react-icons/fi';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import RichTextEditor from '@/components/RichTextEditor';

const AdminProducts = () => {
    const dispatch = useDispatch();
    // Use Redux for products
    const { items: products, loading: productsLoading } = useSelector((state) => state.products);

    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortFilter, setSortFilter] = useState('Newest');
    const [uploadingImages, setUploadingImages] = useState(false);
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '', slug: '', description: '', price: '', stock: '', images: [], isHottest: false
    });
    const toast = useToast();

    useEffect(() => {
        // Optimization: Use cached products if available
        if (products.length === 0) {
            dispatch(fetchAllProducts());
        }
    }, [dispatch, products.length]);

    // Update local loading state
    useEffect(() => {
        setLoading(productsLoading);
    }, [productsLoading]);

    // Force Refresh
    const handleRefresh = () => {
        dispatch(fetchAllProducts());
    };

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + imagePreviews.length > 5) {
            toast.error('Maximum 5 images allowed');
            return;
        }

        setImageFiles(prev => [...prev, ...files]);

        // Create previews
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, { url: reader.result, isNew: true }]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const uploadImages = async () => {
        if (imageFiles.length === 0) return formData.images;

        setUploadingImages(true);
        const uploadedUrls = [...formData.images];

        try {
            for (const file of imageFiles) {
                const formDataUpload = new FormData();
                formDataUpload.append('image', file);

                const { data } = await api.post('/api/upload', formDataUpload, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                uploadedUrls.push(data.url);
            }
            return uploadedUrls;
        } catch (error) {
            throw new Error('Failed to upload images');
        } finally {
            setUploadingImages(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const uploadedImages = await uploadImages();

            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                images: uploadedImages,
            };

            if (editingProduct) {
                await api.put(`/api/products/${editingProduct._id}`, payload);
            } else {
                await api.post('/api/products', payload);
            }

            setShowModal(false);
            setEditingProduct(null);
            setFormData({ name: '', slug: '', description: '', price: '', stock: '', images: [], isHottest: false });
            setImageFiles([]);
            setImagePreviews([]);
            setFormData({ name: '', slug: '', description: '', price: '', stock: '', images: [], isHottest: false });
            setImageFiles([]);
            setImagePreviews([]);
            dispatch(fetchAllProducts()); // Refresh Redux state
            toast.success(editingProduct ? 'Product updated successfully' : 'Product created successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Failed to save product');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price.toString(),
            stock: product.stock.toString(),
            images: product.images || [],
            isHottest: product.isHottest || false,
        });
        setImagePreviews(product.images?.map(url => ({ url, isNew: false })) || []);
        setImageFiles([]);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/api/products/${id}`);
                dispatch(fetchAllProducts()); // Refresh Redux state
                toast.success('Product deleted successfully');
            } catch (error) {
                toast.error('Failed to delete product');
            }
        }
    };

    // Filter Logic
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => {
        switch (sortFilter) {
            case 'Newest': return new Date(b.createdAt) - new Date(a.createdAt);
            case 'Oldest': return new Date(a.createdAt) - new Date(b.createdAt);
            case 'PriceHigh': return b.price - a.price;
            case 'PriceLow': return a.price - b.price;
            case 'StockHigh': return b.stock - a.stock;
            case 'StockLow': return a.stock - b.stock;
            default: return 0;
        }
    });

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Inventory...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#2C2C2C]">Products</h1>
                    <p className="text-gray-500 mt-1">Manage your store's inventory and catalog.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    {/* Search & Filter */}
                    <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm flex-grow sm:flex-grow-0">
                        <div className="relative flex-grow sm:w-64">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                className="w-full pl-9 pr-4 py-2 text-sm bg-transparent outline-none"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="w-[1px] bg-gray-200 my-1"></div>
                        <select
                            value={sortFilter}
                            onChange={(e) => setSortFilter(e.target.value)}
                            className="bg-transparent text-sm px-3 outline-none text-gray-600 font-medium cursor-pointer"
                        >
                            <option value="Newest">Newest</option>
                            <option value="Oldest">Oldest</option>
                            <option value="StockHigh">Stock: High</option>
                            <option value="StockLow">Stock: Low</option>
                            <option value="PriceHigh">Price: High</option>
                            <option value="PriceLow">Price: Low</option>
                        </select>
                    </div>

                    <Button onClick={() => setShowModal(true)} className="flex items-center justify-center gap-2 whitespace-nowrap bg-[#2C2C2C] text-white hover:bg-[#8ABEE8] h-[42px] px-6 rounded-xl font-bold shadow-lg shadow-[#2C2C2C]/20 transition-all">
                        <FiPlus /> Add Product
                    </Button>
                </div>
            </div>

            {/* Products List - Responsive Table */}
            <Card className="overflow-hidden border border-gray-100 shadow-sm bg-white rounded-[2rem]">
                {/* Table View */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-[#F5F8FA] border-b border-gray-100">
                            <tr className="text-left text-gray-400 text-[11px] font-bold uppercase tracking-widest">
                                <th className="px-8 py-5">Product Info</th>
                                <th className="px-8 py-5">Price</th>
                                <th className="px-8 py-5">Stock Status</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-20 text-center text-gray-400">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                                                <FiPackage size={24} />
                                            </div>
                                            <p className="font-medium">No products match your search</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product._id} className="hover:bg-[#F5F8FA] transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-5">
                                                <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200 relative group-hover:scale-105 transition-transform duration-300">
                                                    {product.images?.[0] ? (
                                                        <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full text-gray-400"><FiImage /></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-[#2C2C2C] text-sm flex items-center gap-1.5">{product.isHottest && <span title="Hottest">🔥</span>}{product.name}</h3>
                                                    <p className="text-xs text-gray-400 font-medium mt-0.5">/{product.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 font-bold text-[#2C2C2C] text-sm">${product.price.toFixed(2)}</td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                                                <span className={`text-xs font-bold ${product.stock > 10 ? 'text-emerald-600' : product.stock > 0 ? 'text-amber-600' : 'text-red-600'}`}>
                                                    {product.stock} in stock
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEdit(product)} className="p-2 hover:bg-white rounded-lg text-gray-400 hover:text-[#2C2C2C] transition-colors border border-transparent hover:border-gray-200 shadow-sm"><FiEdit2 size={16} /></button>
                                                <button onClick={() => handleDelete(product._id)} className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors border border-transparent hover:border-red-100 shadow-sm"><FiTrash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Modal Overlay */}
            {showModal && (
                <div className="fixed inset-0 bg-[#2C2C2C]/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
                    <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10">
                            <h2 className="text-xl font-bold text-[#2C2C2C]">
                                {editingProduct ? 'Edit Product' : 'Create New Product'}
                            </h2>
                            <button onClick={() => { setShowModal(false); setEditingProduct(null); }} className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-[#2C2C2C] hover:bg-gray-100 transition-colors"><FiX size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Product Name</label>
                                    <Input
                                        placeholder="e.g. Classic Tote"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="h-12 rounded-xl text-base px-4"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                                    <RichTextEditor
                                        value={formData.description}
                                        onChange={(html) => setFormData({ ...formData, description: html })}
                                        placeholder="Describe the product..."
                                        rows={6}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Price ($)</label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="h-12 rounded-xl"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Stock Quantity</label>
                                    <Input
                                        type="number"
                                        required
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        className="h-12 rounded-xl"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Slug</label>
                                    <Input
                                        className="font-mono text-sm bg-gray-50 h-10"
                                        required
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-2 flex items-center gap-3 py-2">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, isHottest: !formData.isHottest })}
                                        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${formData.isHottest ? 'bg-orange-500' : 'bg-gray-300'}`}
                                    >
                                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${formData.isHottest ? 'translate-x-6' : ''}`} />
                                    </button>
                                    <label className="text-sm font-bold text-gray-600 flex items-center gap-1.5 cursor-pointer" onClick={() => setFormData({ ...formData, isHottest: !formData.isHottest })}>
                                        🔥 Mark as Hottest
                                    </label>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Product Images</label>

                                    {/* Image Preview Grid */}
                                    {imagePreviews.length > 0 && (
                                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
                                            {imagePreviews.map((img, index) => (
                                                <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                                                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                    >
                                                        <FiX size={14} />
                                                    </button>
                                                    {img.isNew && (
                                                        <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-blue-500 text-white text-[10px] font-bold rounded">
                                                            NEW
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Upload Zone */}
                                    {imagePreviews.length < 5 && (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-[#8ABEE8] hover:bg-[#8ABEE8]/5 transition-all group"
                                        >
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleImageSelect}
                                                className="hidden"
                                            />
                                            <FiUploadCloud className="mx-auto text-gray-400 group-hover:text-[#8ABEE8] transition-colors" size={32} />
                                            <p className="mt-2 text-sm font-bold text-gray-500">
                                                Click to upload or drag & drop
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                PNG, JPG, WEBP up to 5MB ({5 - imagePreviews.length} remaining)
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-6 flex gap-4 border-t border-gray-100 mt-6">
                                <Button type="button" variant="secondary" className="flex-1 h-12 rounded-xl font-bold bg-gray-100 text-gray-500 hover:bg-gray-200 border-none" onClick={() => { setShowModal(false); setEditingProduct(null); setImagePreviews([]); setImageFiles([]); }}>Cancel</Button>
                                <Button type="submit" disabled={uploadingImages} className="flex-1 h-12 rounded-xl font-bold bg-[#2C2C2C] text-white hover:bg-[#8ABEE8] disabled:opacity-50 disabled:cursor-not-allowed">
                                    {uploadingImages ? 'Uploading...' : editingProduct ? 'Save Changes' : 'Create Product'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
