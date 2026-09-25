'use client';

import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import {
  Plus,
  Trash2,
  Edit2,
  Image as ImageIcon,
  Check,
  X,
  Loader2,
  FileImage,
  FileVideo,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { upload } from '@vercel/blob/client';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  category: string;
  imageUrl: string | null;
  video: string | null;
  featured: boolean;
}

interface UploadState {
  uploading: boolean;
  progress: number;   // 0–100
  fileName: string;
  fileSize: string;
  error: string | null;
}

const initialUploadState: UploadState = {
  uploading: false,
  progress: 0,
  fileName: '',
  fileSize: '',
  error: null,
};

const MAX_IMAGE_MB = 20;
const MAX_VIDEO_MB = 150;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/ogg', 'video/x-m4v'];

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function UploadProgressBar({ state }: { state: UploadState; type?: 'image' | 'video' }) {
  if (!state.uploading && !state.fileName && !state.error) return null;

  return (
    <div className={`mt-2 rounded-xl border p-3 text-xs ${
      state.error
        ? 'bg-red-50 border-red-200'
        : state.uploading
        ? 'bg-blue-50 border-blue-200'
        : 'bg-green-50 border-green-200'
    }`}>
      <div className="flex items-center gap-2 mb-1.5">
        {state.error ? (
          <AlertCircle size={14} className="text-red-500 shrink-0" />
        ) : state.uploading ? (
          <Loader2 size={14} className="animate-spin text-blue-500 shrink-0" />
        ) : (
          <Check size={14} className="text-green-600 shrink-0" />
        )}
        <span className={`font-bold truncate ${
          state.error ? 'text-red-700' : state.uploading ? 'text-blue-700' : 'text-green-700'
        }`}>
          {state.error ?? (state.uploading ? `Uploading ${state.fileName}…` : `${state.fileName} uploaded`)}
        </span>
        {!state.error && state.fileSize && (
          <span className="ml-auto text-gray-400 shrink-0">{state.fileSize}</span>
        )}
      </div>
      {state.uploading && (
        <div className="w-full bg-blue-200 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full bg-blue-500 rounded-full transition-all duration-200 ${state.progress > 0 ? '' : 'w-1/2 animate-pulse'}`}
            style={state.progress > 0 ? { width: `${state.progress}%` } : undefined}
          />
        </div>
      )}
      {state.uploading && (
        <span className="text-blue-600 font-black text-[10px] mt-1 block text-right">
          {state.progress}%
        </span>
      )}
    </div>
  );
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

  const [imageUpload, setImageUpload] = useState<UploadState>(initialUploadState);
  const [videoUpload, setVideoUpload] = useState<UploadState>(initialUploadState);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const categories = ["Men's Wear", "Women's Wear", "Custom Tailoring"];

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const res = await fetch('/api/products', { cache: 'no-store' });
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products. Please refresh.');
    } finally {
      setLoading(false);
    }
  }

  function validateFile(file: File, type: 'image' | 'video'): string | null {
    const maxMB = type === 'image' ? MAX_IMAGE_MB : MAX_VIDEO_MB;
    const allowedTypes = type === 'image' ? ALLOWED_IMAGE_TYPES : ALLOWED_VIDEO_TYPES;

    if (!allowedTypes.includes(file.type)) {
      const allowed = type === 'image' ? 'JPG, PNG, WebP, GIF' : 'MP4, WebM, MOV, OGG';
      return `Unsupported format "${file.type}". Allowed: ${allowed}`;
    }

    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxMB) {
      return `File too large (${formatBytes(file.size)}). Maximum allowed: ${maxMB} MB`;
    }

    return null;
  }

  async function handleFileUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'imageUrl' | 'video'
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadKind = type === 'imageUrl' ? 'image' : 'video';
    const setUpload = type === 'imageUrl' ? setImageUpload : setVideoUpload;

    // Reset previous state
    setUpload(initialUploadState);

    // Validate before uploading
    const validationError = validateFile(file, uploadKind);
    if (validationError) {
      setUpload({ ...initialUploadState, error: validationError, fileName: file.name });
      toast.error(validationError);
      // Reset input so user can select again
      if (type === 'imageUrl' && imageInputRef.current) imageInputRef.current.value = '';
      if (type === 'video' && videoInputRef.current) videoInputRef.current.value = '';
      return;
    }

    setUpload({
      uploading: true,
      progress: 0,
      fileName: file.name,
      fileSize: formatBytes(file.size),
      error: null,
    });

    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
      const blob = await upload(`lycaronz-designs/${safeName}`, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
        contentType: file.type || undefined,
        multipart: file.size > 4 * 1024 * 1024,
      });

      if (!blob.url) {
        throw new Error('Upload finished without a file address.');
      }

      setFormData(prev => ({ ...prev, [type]: blob.url }));
      setUpload(prev => ({ ...prev, uploading: false, progress: 100 }));
      toast.success(`${uploadKind === 'image' ? 'Image' : 'Video'} uploaded successfully!`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upload failed. Please try again.';
      console.error('Upload error:', error);
      setUpload({ ...initialUploadState, error: message, fileName: file.name, fileSize: formatBytes(file.size) });
      toast.error(message);
      // Reset input so user can try again
      if (type === 'imageUrl' && imageInputRef.current) imageInputRef.current.value = '';
      if (type === 'video' && videoInputRef.current) videoInputRef.current.value = '';
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name.trim()) { toast.error('Product name is required.'); return; }
    if (!formData.category.trim()) { toast.error('Category is required.'); return; }
    if (formData.price.trim() !== '' && (Number.isNaN(Number(formData.price)) || Number(formData.price) < 0)) {
      toast.error('Price must be a number, or leave it blank for a custom quote.');
      return;
    }

    try {
      setIsSubmitting(true);
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const saved = await res.json();
        toast.success(editingProduct ? 'Product updated!' : 'Product added to catalog!');
        closeModal();
        // Update local state immediately — no need to refetch
        if (editingProduct) {
          setProducts(prev => prev.map(p => p.id === saved.id ? saved : p));
        } else {
          setProducts(prev => [saved, ...prev]);
        }
      } else {
        const errData = await res.json();
        toast.error(errData.error || 'Failed to save product');
      }
    } catch {
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteProduct(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        toast.success('Product removed from catalog.');
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to delete product.');
      }
    } catch {
      toast.error('Network error while deleting. Please try again.');
    }
  }

  function handleEdit(product: Product) {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price != null ? String(product.price) : '',
      category: product.category,
      imageUrl: product.imageUrl || '',
      video: product.video || '',
      featured: product.featured || false,
    });
    setImageUpload(initialUploadState);
    setVideoUpload(initialUploadState);
    setIsModalOpen(true);
  }

  function openNewModal() {
    setEditingProduct(null);
    setFormData({ name: '', description: '', price: '', category: "Women's Wear", imageUrl: '', video: '', featured: false });
    setImageUpload(initialUploadState);
    setVideoUpload(initialUploadState);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingProduct(null);
    setImageUpload(initialUploadState);
    setVideoUpload(initialUploadState);
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
  }

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-gray-900 uppercase">Products &amp; Catalog</h1>
          <p className="text-gray-500 font-medium text-xs sm:text-sm mt-0.5">Manage your atelier pieces, pricing, and gallery photos.</p>
        </div>
        <button
          onClick={openNewModal}
          className="w-full sm:w-auto btn-gold flex items-center justify-center gap-2 py-3 px-6 text-xs sm:text-sm"
        >
          <Plus size={18} />
          <span>ADD NEW PRODUCT</span>
        </button>
      </header>

      {/* Product List Desktop Table */}
      <div className="bg-white rounded-3xl sm:rounded-[2.5rem] shadow-sm border border-gray-200/80 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 sm:px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Product</th>
                <th className="px-6 sm:px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Category</th>
                <th className="px-6 sm:px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Price</th>
                <th className="px-6 sm:px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-amber-500" size={36} />
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((product: Product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 sm:px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex-shrink-0 overflow-hidden relative border border-gray-200">
                          {product.imageUrl ? (
                            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" unoptimized />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <ImageIcon size={22} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-gray-900 uppercase tracking-tight truncate">{product.name}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{product.description}</p>
                          {product.featured && (
                            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Featured</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 sm:px-8 py-5">
                      <span className="px-3.5 py-1 bg-gray-100 text-gray-700 text-[10px] font-black uppercase tracking-widest rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 sm:px-8 py-5">
                      <p className="font-black text-gray-900">
                        UGX {product.price ? product.price.toLocaleString() : '0'}
                      </p>
                    </td>
                    <td className="px-6 sm:px-8 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(product)}
                          aria-label={`Edit ${product.name}`}
                          className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id, product.name)}
                          aria-label={`Delete ${product.name}`}
                          className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-gray-400 font-bold uppercase tracking-widest italic">
                    No products in the collection yet. Add your first piece!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="animate-spin mx-auto text-amber-500" size={32} />
            </div>
          ) : products.length > 0 ? (
            products.map((product: Product) => (
              <div key={product.id} className="p-4 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden relative shrink-0 border border-gray-200">
                    {product.imageUrl ? (
                      <Image src={product.imageUrl} alt={product.name} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ImageIcon size={20} />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-sm text-gray-900 uppercase tracking-tight truncate">{product.name}</p>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">{product.category}</span>
                    <p className="font-black text-amber-600 text-xs mt-0.5">UGX {product.price ? product.price.toLocaleString() : '0'}</p>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                  <button onClick={() => handleEdit(product)} className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs">
                    <Edit2 size={14} /><span>Edit</span>
                  </button>
                  <button onClick={() => deleteProduct(product.id, product.name)} className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-red-50 text-red-600 rounded-xl font-bold text-xs">
                    <Trash2 size={14} /><span>Delete</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-gray-400 font-bold text-xs uppercase tracking-wider">
              No products found. Add your first piece!
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-[3rem] shadow-2xl overflow-hidden max-h-[min(92vh,100dvh)] overflow-y-auto overscroll-contain"
            >
              <div className="p-4 xs:p-6 sm:p-10">
                <div className="flex justify-between items-center mb-6 sm:mb-8 gap-3">
                  <h2 className="text-xl xs:text-2xl sm:text-3xl font-black uppercase tracking-tight min-w-0">
                    {editingProduct ? 'Edit Product' : 'New Product'}
                  </h2>
                  <button
                    onClick={closeModal}
                    aria-label="Close modal"
                    className="p-2.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-all shrink-0"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name + Price */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Product Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input-field"
                        placeholder="e.g. Elegant Silk Gown"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Price (UGX)</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="input-field"
                        placeholder="Leave blank for a custom quote"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="input-field resize-none"
                      placeholder="Describe the product details, fabric, and styling…"
                    />
                  </div>

                  {/* Category + Featured */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-end">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="input-field appearance-none cursor-pointer"
                      >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="flex items-center gap-3 pb-1">
                      <label className="relative flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[22px] after:w-[22px] after:transition-all peer-checked:bg-amber-500" />
                        <span className="ml-3 text-xs font-black text-gray-600 uppercase tracking-widest">Mark as Featured</span>
                      </label>
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Product Image</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 hover:border-amber-400/60 transition-colors">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                        onChange={(e) => handleFileUpload(e, 'imageUrl')}
                        className="hidden"
                        id="image-upload"
                        ref={imageInputRef}
                        disabled={imageUpload.uploading}
                      />
                      <label
                        htmlFor="image-upload"
                        className={`flex flex-col items-center justify-center gap-2 py-3 cursor-pointer ${imageUpload.uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                          {imageUpload.uploading ? <Loader2 size={20} className="animate-spin" /> : <FileImage size={20} />}
                        </div>
                        <span className="text-xs font-black text-gray-700 uppercase tracking-wider">
                          {imageUpload.uploading ? 'Uploading…' : 'Click to upload image'}
                        </span>
                        <span className="text-[10px] text-gray-400">JPG, PNG, WebP — max {MAX_IMAGE_MB} MB</span>
                      </label>

                      {/* Also allow direct URL input */}
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <input
                          type="text"
                          value={formData.imageUrl}
                          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                          className="input-field text-xs"
                          placeholder="Or paste image URL directly…"
                        />
                      </div>
                    </div>
                    <UploadProgressBar state={imageUpload} type="image" />

                    {/* Image Preview */}
                    {formData.imageUrl && !imageUpload.uploading && (
                      <div className="relative w-full h-40 mt-2 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                        <Image
                          src={formData.imageUrl}
                          alt="Preview"
                          fill
                          className="object-contain"
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={() => { setFormData(p => ({ ...p, imageUrl: '' })); setImageUpload(initialUploadState); }}
                          aria-label="Remove image"
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 shadow"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Video Upload */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Product Video <span className="text-gray-300 font-bold">(optional)</span></label>
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 hover:border-amber-400/60 transition-colors">
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime,video/ogg,video/x-m4v"
                        onChange={(e) => handleFileUpload(e, 'video')}
                        className="hidden"
                        id="video-upload"
                        ref={videoInputRef}
                        disabled={videoUpload.uploading}
                      />
                      <label
                        htmlFor="video-upload"
                        className={`flex flex-col items-center justify-center gap-2 py-3 cursor-pointer ${videoUpload.uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center">
                          {videoUpload.uploading ? <Loader2 size={20} className="animate-spin" /> : <FileVideo size={20} />}
                        </div>
                        <span className="text-xs font-black text-gray-700 uppercase tracking-wider">
                          {videoUpload.uploading ? 'Uploading…' : 'Click to upload video'}
                        </span>
                        <span className="text-[10px] text-gray-400">MP4, WebM, MOV — max {MAX_VIDEO_MB} MB</span>
                      </label>

                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <input
                          type="text"
                          value={formData.video}
                          onChange={(e) => setFormData({ ...formData, video: e.target.value })}
                          className="input-field text-xs"
                          placeholder="Or paste video URL directly…"
                        />
                      </div>
                    </div>
                    <UploadProgressBar state={videoUpload} type="video" />

                    {/* Video Preview */}
                    {formData.video && !videoUpload.uploading && (
                      <div className="mt-2 relative">
                        <video
                          src={formData.video}
                          controls
                          preload="metadata"
                          className="w-full rounded-xl border border-gray-200 max-h-48"
                        />
                        <button
                          type="button"
                          onClick={() => { setFormData(p => ({ ...p, video: '' })); setVideoUpload(initialUploadState); }}
                          aria-label="Remove video"
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 shadow"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Submit */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting || imageUpload.uploading || videoUpload.uploading}
                      className="w-full btn-primary py-4 rounded-2xl text-base sm:text-lg disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl"
                    >
                      {isSubmitting ? (
                        <><Loader2 className="animate-spin" size={22} /><span>Saving…</span></>
                      ) : (
                        <><Check size={22} /><span>{editingProduct ? 'Save Changes' : 'Add to Catalog'}</span></>
                      )}
                    </button>
                    {(imageUpload.uploading || videoUpload.uploading) && (
                      <p className="text-center text-xs text-amber-600 font-bold mt-2">
                        Please wait for the upload to finish before saving.
                      </p>
                    )}
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
