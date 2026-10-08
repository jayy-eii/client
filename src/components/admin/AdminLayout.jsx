import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminOverview from './AdminOverview';
import AdminProductsList from './AdminProductsList';
import AdminProductForm from './AdminProductForm';
import AdminCategories from './AdminCategories';
import AdminCategoryForm from './AdminCategoryForm';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Layers,
  FolderPlus,
  LogOut,
  ExternalLink,
  Loader2,
} from 'lucide-react';

export default function AdminLayout() {
  const { admin, isAuthenticated, isLoading, logout, authFetch } = useAuth();
  const navigate = useNavigate();

  // 'overview' | 'products' | 'add' | 'edit' | 'categories' | 'add-category' | 'edit-category'
  const [activeTab, setActiveTab] = useState('overview');
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [filterCategoryInProducts, setFilterCategoryInProducts] = useState('all');

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  const loadData = async () => {
    setDataLoading(true);
    try {
      // 1. Fetch all products (including hidden)
      const prodRes = await authFetch('/api/products?all=true');
      const prodData = await prodRes.json();
      if (prodData.success) {
        setProducts(prodData.products || []);
      }

      // 2. Fetch all categories (including hidden)
      const catRes = await fetch('/api/categories?all=true');
      const catData = await catRes.json();
      if (catData.success) {
        setCategories(catData.categories || []);
      }

      // 3. Fetch admin stats
      const statsRes = await authFetch('/api/products/admin/stats');
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Product Actions
  const handleStartEditProduct = (product) => {
    setEditingProduct(product);
    setActiveTab('edit');
  };

  const handleProductFormSuccess = () => {
    loadData();
    setEditingProduct(null);
    setActiveTab('products');
  };

  const handleProductFormCancel = () => {
    setEditingProduct(null);
    setActiveTab('products');
  };

  // Category Actions
  const handleStartEditCategory = (category) => {
    setEditingCategory(category);
    setActiveTab('edit-category');
  };

  const handleCategoryFormSuccess = () => {
    loadData();
    setEditingCategory(null);
    setActiveTab('categories');
  };

  const handleCategoryFormCancel = () => {
    setEditingCategory(null);
    setActiveTab('categories');
  };

  const handleSelectCategoryForFilter = (catName) => {
    setFilterCategoryInProducts(catName);
    setActiveTab('products');
  };

  const handleAddProductForCategory = (catName) => {
    setEditingProduct({ category: catName });
    setActiveTab('add');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#8C6542]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1C1C1A] flex flex-col antialiased">
      {/* Top Admin Navbar */}
      <header className="bg-white border-b border-[#ECE7DE] sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Logo & Admin Badge */}
            <div className="flex items-center gap-3">
              <Link to="/admin" onClick={() => setActiveTab('overview')} className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#8C6542] text-white flex items-center justify-center font-serif text-lg font-bold shadow-2xs">
                  Y
                </div>
                <div>
                  <span className="font-serif font-bold text-lg text-[#1C1C1A]">
                    Yash Cloth Stores
                  </span>
                  <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-[#F4EFEA] text-[#8C6542] uppercase tracking-wider">
                    Owner Portal
                  </span>
                </div>
              </Link>
            </div>

            {/* Center Tabs Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-[#1C1C1A] text-white shadow-xs'
                    : 'text-[#54534F] hover:bg-[#F2ECE3]'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFilterCategoryInProducts('all');
                  setActiveTab('products');
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'products'
                    ? 'bg-[#1C1C1A] text-white shadow-xs'
                    : 'text-[#54534F] hover:bg-[#F2ECE3]'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Products ({products.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('categories')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'categories'
                    ? 'bg-[#1C1C1A] text-white shadow-xs'
                    : 'text-[#54534F] hover:bg-[#F2ECE3]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Categories ({categories.length})</span>
              </button>

              <div className="h-4 w-px bg-[#E3DBD0] mx-1" />

              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setActiveTab('add');
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'add'
                    ? 'bg-[#8C6542] text-white shadow-xs'
                    : 'text-[#8C6542] hover:bg-[#F4EFEA]'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingCategory(null);
                  setActiveTab('add-category');
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'add-category'
                    ? 'bg-[#8C6542] text-white shadow-xs'
                    : 'text-[#8C6542] hover:bg-[#F4EFEA]'
                }`}
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>Add Category</span>
              </button>
            </nav>

            {/* Right side: Live Store link, Admin User, Logout */}
            <div className="flex items-center gap-3">
              <Link
                to="/"
                target="_blank"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D5CEC4] text-xs font-semibold text-[#1C1C1A] hover:bg-[#FAF9F6] transition-colors"
                title="Open customer view in new tab"
              >
                <span>Live Store</span>
                <ExternalLink className="w-3 h-3 text-[#8C6542]" />
              </Link>

              <div className="hidden xl:block text-right">
                <p className="text-[11px] font-bold text-[#1C1C1A] truncate max-w-[140px]">
                  {admin?.email || 'Store Owner'}
                </p>
                <p className="text-[10px] text-[#7A7873]">Administrator</p>
              </div>

              <button
                type="button"
                onClick={logout}
                className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                title="Logout from Admin"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Mobile secondary tab strip */}
        <div className="lg:hidden flex items-center justify-start border-t border-[#F0ECE4] px-2 py-2 overflow-x-auto text-xs gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap ${
              activeTab === 'overview' ? 'bg-[#1C1C1A] text-white' : 'text-gray-600'
            }`}
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => {
              setFilterCategoryInProducts('all');
              setActiveTab('products');
            }}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap ${
              activeTab === 'products' ? 'bg-[#1C1C1A] text-white' : 'text-gray-600'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap ${
              activeTab === 'categories' ? 'bg-[#1C1C1A] text-white' : 'text-gray-600'
            }`}
          >
            Categories ({categories.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingProduct(null);
              setActiveTab('add');
            }}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap ${
              activeTab === 'add' ? 'bg-[#8C6542] text-white' : 'text-[#8C6542]'
            }`}
          >
            + Product
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingCategory(null);
              setActiveTab('add-category');
            }}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap ${
              activeTab === 'add-category' ? 'bg-[#8C6542] text-white' : 'text-[#8C6542]'
            }`}
          >
            + Category
          </button>
        </div>
      </header>

      {/* Main Admin Dashboard Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {activeTab === 'overview' && (
          <AdminOverview
            stats={stats}
            products={products}
            categories={categories}
            onNavigate={(tab) => {
              if (tab === 'add-category') {
                setEditingCategory(null);
              }
              setActiveTab(tab);
            }}
            onEditProduct={handleStartEditProduct}
          />
        )}

        {activeTab === 'products' && (
          <AdminProductsList
            products={products}
            categories={categories}
            initialCategory={filterCategoryInProducts}
            isLoading={dataLoading}
            onRefresh={loadData}
            onEditProduct={handleStartEditProduct}
            onAddNew={() => {
              setEditingProduct(null);
              setActiveTab('add');
            }}
          />
        )}

        {activeTab === 'add' && (
          <AdminProductForm
            categories={categories}
            productToEdit={editingProduct}
            onSuccess={handleProductFormSuccess}
            onCancel={handleProductFormCancel}
          />
        )}

        {activeTab === 'edit' && (
          <AdminProductForm
            productToEdit={editingProduct}
            categories={categories}
            onSuccess={handleProductFormSuccess}
            onCancel={handleProductFormCancel}
          />
        )}

        {activeTab === 'categories' && (
          <AdminCategories
            categories={categories}
            onRefresh={loadData}
            onAddNewCategory={() => {
              setEditingCategory(null);
              setActiveTab('add-category');
            }}
            onEditCategory={handleStartEditCategory}
            onSelectCategoryForFilter={handleSelectCategoryForFilter}
            onAddProductForCategory={handleAddProductForCategory}
          />
        )}

        {activeTab === 'add-category' && (
          <AdminCategoryForm
            onSuccess={handleCategoryFormSuccess}
            onCancel={handleCategoryFormCancel}
          />
        )}

        {activeTab === 'edit-category' && (
          <AdminCategoryForm
            categoryToEdit={editingCategory}
            onSuccess={handleCategoryFormSuccess}
            onCancel={handleCategoryFormCancel}
          />
        )}
      </main>

      {/* Admin Footer */}
      <footer className="py-4 border-t border-[#ECE7DE] text-center text-xs text-[#7A7873] bg-white">
        <p>Yash Cloth Stores — Private Store Management Portal • Bajaria, Nagpur</p>
      </footer>
    </div>
  );
}
