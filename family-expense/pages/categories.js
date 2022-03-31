import Category from "../components/Category";
import AppLayout from "../components/Layout";

export default function CategoryPage() {
  return (
    <AppLayout page="category" title="Categories">
      <Category></Category>
    </AppLayout>
  );
}