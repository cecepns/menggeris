import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { productAPI, categoryAPI } from "../utils/api";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [currentPage, selectedCategory, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll(
        currentPage,
        selectedCategory,
        searchQuery
      );
      setProducts(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="pt-16 min-h-screen bg-cream-50">
      {/* Header */}
      <section 
        className="relative h-96 text-white py-16 bg-cover bg-center bg-no-repeat"
        
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-wood-dark"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-center mb-4">
            Our Collections
          </h1>
          <p className="text-xl text-gray-200 text-center max-w-3xl mx-auto">
            Discover our handcrafted wooden timepieces, each telling a unique
            story of tradition and precision from East Borneo.
          </p>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-6 bg-cream-100 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wood-maroon focus:border-transparent"
                />
              </div>
            </form>

            {/* View Mode and Filter Toggle */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 lg:hidden"
              >
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </button>

              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid"
                      ? "bg-wood-dark text-white"
                      : "bg-white text-gray-600"
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list"
                      ? "bg-wood-dark text-white"
                      : "bg-white text-gray-600"
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`w-full lg:w-64 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
          >
            <div className="bg-cream-100 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryFilter("")}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    selectedCategory === ""
                      ? "bg-wood-dark text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  All Products
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryFilter(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedCategory === category.id
                        ? "bg-wood-dark text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products */}
          <main className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wood-maroon"></div>
              </div>
            ) : (
              <>
                {/* Products Grid/List */}
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "space-y-6"
                  }
                >
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className={`bg-cream-100 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow ${
                        viewMode === "list" ? "flex" : ""
                      }`}
                    >
                      <div
                        className={`${
                          viewMode === "list" ? "w-64" : "aspect-square"
                        } overflow-hidden`}
                      >
                        <img
                          src={
                            product.images?.[0]
                              ? `https://api-inventory.isavralabel.com/menggeris/uploads-menggaris/${product.images[0]}`
                              : "https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=400"
                          }
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                      <div
                        className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}
                      >
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {product.name}
                        </h3>
                        <p
                          dangerouslySetInnerHTML={{
                            __html: product.description,
                          }}
                          className="text-gray-600 mb-4 line-clamp-2"
                        />
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-wood-maroon">
                            ${product.price?.toLocaleString()}
                          </span>
                          <Link
                            to={`/product/${product.id}`}
                            className="bg-wood-dark text-white px-4 py-2 rounded-lg hover:bg-wood-DEFAULT transition-colors"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-8 space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-lg ${
                            currentPage === page
                              ? "bg-wood-dark text-white"
                              : "border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                )}

                {products.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                      No products found matching your criteria.
                    </p>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
