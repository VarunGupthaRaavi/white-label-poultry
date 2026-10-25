'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { operationsService } from '../../../lib/operationsService';
import { AdminProductRecord } from '../../../types/operations';
import {
  Tag,
  Plus,
  Edit2,
  CheckCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  X,
  ShieldCheck,
  Image,
} from 'lucide-react';

export default function SellerProductsPage() {
  const { tenantId, sellerId, user } = useAuth();
  const [products, setProducts] = useState<AdminProductRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProductRecord | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('live_birds');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('150');
  const [unit, setUnit] = useState('kg');
  const [stock, setStock] = useState('50');
  const [vaccinationDetails, setVaccinationDetails] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const refreshProducts = () => {
    setProducts(operationsService.getProducts(tenantId, sellerId));
  };

  useEffect(() => {
    refreshProducts();
  }, [tenantId, sellerId]);

  const handleOpenProposeModal = () => {
    setEditingProduct(null);
    setTitle('');
    setCategory('live_birds');
    setDescription('');
    setPrice('150');
    setUnit('kg');
    setStock('50');
    setVaccinationDetails('Marek, ND-IB vaccinated');
    setImageUrl('https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=600&q=80');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: AdminProductRecord) => {
    setEditingProduct(p);
    setTitle(p.title);
    setCategory(p.category);
    setDescription(p.description);
    setPrice(p.price.toString());
    setUnit(p.unit);
    setStock(p.stockAvailable.toString());
    setVaccinationDetails(p.vaccinationDetails || '');
    setImageUrl(p.images[0] || '');
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock, 10);

    if (editingProduct) {
      // Seller updating existing product price or stock
      operationsService.updateProductPriceAndStock(editingProduct.id, priceNum, stockNum);
    } else {
      // Seller proposing new product SKU (marked as pending_approval - CANNOT self-approve!)
      operationsService.createProduct({
        tenantId,
        sellerId: sellerId || 'seller_krishna_01',
        sellerName: user?.displayName || 'Krishna Broiler & Layer Farms',
        title,
        category,
        description,
        price: priceNum,
        unit,
        stockAvailable: stockNum,
        minOrderQuantity: 1,
        status: 'pending_approval', // Strictly pending admin moderation!
        healthCertified: true,
        vaccinationDetails,
        images: [imageUrl || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=600&q=80'],
      });
      alert('Product proposal submitted to hub administrator for catalog moderation.');
    }

    setIsModalOpen(false);
    refreshProducts();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">My Products & Live Bird Inventory</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your farm listings, adjust rates in Indian Rupees (₹), and propose new bird batches.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refreshProducts}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-xl"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleOpenProposeModal}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md shadow-amber-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Propose New Produce SKU</span>
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => {
          const isPending = p.status === 'pending_approval';
          return (
            <div
              key={p.id}
              className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-100">{p.title}</h3>
                    <span className="text-[10px] font-mono uppercase text-slate-500">{p.category}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                      p.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : p.status === 'pending_approval'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {p.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{p.description}</p>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-mono">Current Price</span>
                    <p className="text-base font-extrabold text-blue-400 font-mono">₹{p.price} / {p.unit}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 text-[10px] uppercase font-mono">Available Stock</span>
                    <p className="text-base font-extrabold text-slate-100 font-mono">
                      {p.stockAvailable} {p.unit}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">
                  {isPending ? 'Under catalog review' : 'Live on customer app'}
                </span>
                <button
                  onClick={() => handleOpenEditModal(p)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Update Stock / Price</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Propose / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-slate-100">
                {editingProduct ? `Update ${editingProduct.title}` : 'Propose New Produce Batch SKU'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              {!editingProduct && (
                <>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Product Title</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Free-Range Giriraja Rooster (Live)"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                      >
                        <option value="live_birds">Live Birds</option>
                        <option value="country_chicken">Country Chicken</option>
                        <option value="eggs">Eggs</option>
                        <option value="fresh_meat">Fresh Meat</option>
                        <option value="specialty_poultry">Specialty Poultry</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Unit</label>
                      <select
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                      >
                        <option value="kg">Per kg</option>
                        <option value="pack">Per pack</option>
                        <option value="bird">Per bird</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Price in INR (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Available Batch Stock</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Produce Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono text-[11px]"
                />
              </div>

              {!editingProduct && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-400 flex items-center gap-2">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span>
                    New product proposals will be reviewed by the hub admin before becoming visible on the customer mobile app.
                  </span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl"
                >
                  {editingProduct ? 'Save Adjustments' : 'Submit for Moderation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
