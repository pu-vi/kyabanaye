import DishForm, { DishFormData } from "@/app/dish/DishForm";

async function fetchDish(id: string): Promise<DishFormData | null> {
  // TODO: Replace with actual data loading from the database using id.
  if (!id) return null;
  return {
    name: "Palak Paneer",
    description: "Creamy spinach curry with soft paneer cubes.",
    recipeUrl: "https://example.com/palak-paneer",
    category: "veg",
    selectedMealTypes: ["breakfast", "lunch", "dinner"],
    imageName: "palak-paneer.jpg",
  };
}

export default async function DishPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dish = await fetchDish(id);

  if (!dish) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-900">Dish not found</p>
          <p className="mt-2 text-sm text-slate-500">
            The requested dish does not exist.
          </p>
        </div>
      </div>
    );
  }

  return <DishForm title="Edit Dish" initialDish={dish} />;
}
