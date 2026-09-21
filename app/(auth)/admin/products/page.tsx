'use client';

import { useEffect, useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Image as ImageIcon, 
  Video, 
  Check, 
  X,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  imageUrl: string | null;
  video: string | null;
  featured: boolean;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: "Women's Wear",
    imageUrl: '',
    video: '',
    featured: false,
  });

  const categories = ["Men's Wear", "Women's Wear", "Custom Tailoring"];

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, type: 'imageUrl' | 'video') {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });
      const data = await res.json();
      if (data.url) {
        setFormData(prev => ({ ...prev, [type]: data.url }));
        toast.success(`${type === 'imageUrl' ? 'Image' : 'Video'} uploaded successfully!`);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const url = editingProduct 
        ? `/api/products/${editingProduct.id}`
        : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(editingProduct ? 'Product updated!' : 'Product created!');
        setIsModalOpen(false);
        setEditingProduct(null);
        setFormData({
          name: '',
          description: '',
          price: '',
          category: "Women's Wear",
          imageUrl: '',
          video: '',
          featured: false,
        });
        fetchProducts();
      } else {
        const errData = await res.json();
        toast.error(errData.error || 'Failed to save product');
      }
    } catch (error) {
      console.error('Failed to save product:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts(products.filter((p: Product) => p.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  }

  function handleEdit(product: Product) {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category,
      imageUrl: product.imageUrl || '',
      video: product.video || '',
      featured: product.featured || false,
    });
    setIsModalOpen(true);
  }

  function openNewModal() {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: "Women's Wear",
      imageUrl: '',
      video: '',
      featured: false,
    });
    setIsModalOpen(true);
  }

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900 uppercase">Products</h1>
          <p className="text-gray-500 font-medium text-center sm:text-left">Manage your boutique&apos;s collection.</p>
        </div>
        <button 
          onClick={openNewModal}
          className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2 px-8 py-4"
        >
          <Plus size={24} />
          ADD NEW PRODUCT
        </button>
      </header>

      {/* Product List */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Product</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest hidden md:table-cell">Category</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Price</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-primary" size={40} />
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((product: Product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex-shrink-0 overflow-hidden relative">
                          {product.imageUrl ? (
                            <Image src={product.imageUrl} alt="" fill className="object-cover" unoptimized />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-primary/20">
                              <ImageIcon size={24} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-black text-gray-900 uppercase tracking-tight">{product.name}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 hidden md:table-cell">
                      <span className="px-4 py-1.5 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-black text-gray-900">UGX {product.price.toLocaleString()}</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(product)}
                          className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => deleteProduct(product.id)}
                          className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-gray-400 font-bold uppercase tracking-widest italic">
                    No products found in the collection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="p-10">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-3xl font-black uppercase tracking-tight">
                    {editingProduct ? 'Edit Product' : 'New Product'}
                  </h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-all">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">Product Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="input-field"
                        placeholder="e.g. Elegant Silk Gown"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">Price (UGX)</label>
                      <input
                        type="number"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="input-field"
                        placeholder="e.g. 150000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">Description</label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="input-field resize-none"
                      placeholder="Describe the product details..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="input-field appearance-none cursor-pointer"
                      >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="flex items-center gap-4 pt-6">
                      <label className="relative flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                        <span className="ml-3 text-sm font-black text-gray-600 uppercase tracking-widest">Featured</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">Product Image</label>
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          value={formData.imageUrl}
                          onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                          className="input-field"
                          placeholder="Image URL..."
                        />
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'imageUrl')}
                            className="hidden"
                            id="image-upload"
                          />
                          <label 
                            htmlFor="image-upload"
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-gray-200 transition-all"
                          >
                            <ImageIcon size={16} />
                            {uploading ? 'Uploading...' : 'Upload Image'}
                          </label>
                          {formData.imageUrl && (
                            <div className="mt-3 relative w-full h-40">
                              <Image 
                                src={formData.imageUrl} 
                                alt="Preview" 
                                fill
                                className="object-cover rounded-xl" 
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">Product Video</label>
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          value={formData.video}
                          onChange={(e) => setFormData({...formData, video: e.target.value})}
                          className="input-field"
                          placeholder="Video URL..."
                        />
                        <div className="relative">
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => handleFileUpload(e, 'video')}
                            className="hidden"
                            id="video-upload"
                          />
                          <label 
                            htmlFor="video-upload"
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-gray-200 transition-all"
                          >
                            <Video size={16} />
                            {uploading ? 'Uploading...' : 'Upload Video'}
                          </label>
                          {formData.video && (
                            <div className="mt-3">
                              <video src={formData.video} controls className="w-full h-40 rounded-xl object-cover" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-primary py-5 rounded-[2rem] text-xl disabled:opacity-50 flex items-center justify-center gap-3 shadow-2xl"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin" size={24} />
                          SAVING...
                        </>
                      ) : (
                        <>
                          <Check size={24} />
                          SAVE PRODUCT
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
