import Footer from "../components/Footer";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";

interface Props {
  children: React.ReactNode;
  showSearchBar?: boolean;
}

const Layout = ({ children, showSearchBar = true }: Props) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <Header />
      {showSearchBar && (
        <div className="container mx-auto px-4">
          <SearchBar />
        </div>
      )}
      <main className="container mx-auto px-4 py-8 flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;