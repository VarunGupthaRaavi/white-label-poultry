'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { operationsService } from '../../../lib/operationsService';
import { AdminProductRecord } from '../../../types/operations';
import {
  Tag,
  Search,
  Filter,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Edit2,
  X,
  ShieldCheck,
  Percent,
} from 'lucide-react';

export default function AdminProductsPage() {
  const { tenantId, user } = useAuth();
  const [products, setProducts] = useState<AdminProductRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProductRecord | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('live_birds');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('145');
  const [unit, setUnit] = useState('kg');
  const [stock, setStock] = useState('100');
  const [minOrder, setMinOrder] = useState('1');
  const [healthCertified, setHealthCertified] = useState(true);
  const [vaccinationDetails, setVaccinationDetails] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const refreshProducts = () => {
    setProducts(operationsService.getProducts(tenantId));
  };

  useEffect(() => {
    refreshProducts();
  }, [tenantId]);

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setTitle('');
    setCategory('live_birds');
    setDescription('');
    setPrice('150');
    setUnit('kg');
    setStock('100');
    setMinOrder('1');
    setHealthCertified(true);
    setVaccinationDetails('Marek, ND-IB, IBD vaccinated.');
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
    setMinOrder(p.minOrderQuantity.toString());
    setHealthCertified(p.healthCertified);
    setVaccinationDetails(p.vaccinationDetails || '');
    setImageUrl(p.images[0] || '');
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock, 10);
    const minOrderNum = parseInt(minOrder, 10);

    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Please enter a valid price in INR (₹)');
      return;
    }

    if (editingProduct) {
      operationsService.updateProductPriceAndStock(editingProduct.id, priceNum, stockNum);
    } else {
      operationsService.createProduct({
        tenantId,
        sellerId: 'seller_krishna_01',
        sellerName: 'Krishna Broiler & Layer Farms',
        title,
        category,
        description,
        price: priceNum,
        unit,
        stockAvailable: stockNum,
        minOrderQuantity: minOrderNum,
        status: 'active',
        healthCertified,
        vaccinationDetails,
        images: [imageUrl || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=600&q=80'],
      });
    }

    setIsModalOpen(false);
    refreshProducts();
  };

  const handleModerate = (id: string, status: 'active' | 'rejected') => {
    operationsService.moderateProduct(id, status);
    refreshProducts();
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Products & Category Catalog</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage poultry SKUs, pricing in Indian Rupees (₹), live flock certificates, and moderation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={refreshProducts}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-xl"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-blue-400 hover:bg-blue-300 rounded-xl transition-all shadow-md shadow-blue-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Product SKU</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search produce by title or seller..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
        >
          <option value="all">All Categories</option>
          <option value="live_birds">Live Birds</option>
          <option value="country_chicken">Country Chicken</option>
          <option value="eggs">Eggs</option>
          <option value="fresh_meat">Fresh Meat</option>
          <option value="specialty_poultry">Specialty (Kadaknath)</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="pending_approval">Pending Approval</option>
          <option value="out_of_stock">Out of Stock</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Produce / Item</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Seller Farm</th>
                <th className="py-3 px-4 font-semibold">Price (₹ INR)</th>
                <th className="py-3 px-4 font-semibold">Stock</th>
                <th className="py-3 px-4 font-semibold">Health Cert</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProducts.map((p) => {
                const isPending = p.status === 'pending_approval';
                return (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-100">{p.title}</div>
                      <div className="text-[11px] text-slate-500 font-mono truncate max-w-[200px]">
                        {p.description}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] uppercase font-bold font-mono">
                        {p.category.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{p.sellerName}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-100">
                      ₹{p.price} / {p.unit}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span
                        className={`font-bold ${
                          p.stockAvailable < 30 ? 'text-rose-400' : 'text-slate-200'
                        }`}
                      >
                        {p.stockAvailable} {p.unit}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {p.healthCertified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Vet Certified</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500">Uncertified</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                          p.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : p.status === 'pending_approval'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : p.status === 'out_of_stock'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {p.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      {isPending ? (
                        <>
                          <button
                            onClick={() => handleModerate(p.id, 'active')}
                            className="px-2 py-1 text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition-all"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleModerate(p.id, 'rejected')}
                            className="px-2 py-1 text-[11px] font-semibold text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl my-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-slate-100">
                {editingProduct ? 'Edit Produce SKU Pricing & Stock' : 'Add New Poultry Product'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Fresh Kadaknath Broiler Chicken"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none"
                  >
                    <option value="live_birds">Live Birds</option>
                    <option value="country_chicken">Country Chicken</option>
                    <option value="eggs">Eggs</option>
                    <option value="fresh_meat">Fresh Meat</option>
                    <option value="specialty_poultry">Specialty Poultry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Unit of Measure</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none"
                  >
                    <option value="kg">Per Kilogram (kg)</option>
                    <option value="pack">Per Pack (pack)</option>
                    <option value="bird">Per Live Bird (bird)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Price in INR (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Stock Available</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Produce specifications, flock origin, diet..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Vaccination & Vet Details</label>
                <input
                  type="text"
                  value={vaccinationDetails}
                  onChange={(e) => setVaccinationDetails(e.target.value)}
                  placeholder="e.g. Ranikhet disease, Marek, IBD vaccinated"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-slate-950 bg-blue-400 hover:bg-blue-300 rounded-xl transition-all shadow-md shadow-blue-500/20"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
