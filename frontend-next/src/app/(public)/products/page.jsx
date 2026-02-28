import ProductsClient from './ProductsClient';

export const metadata = {
  title: 'Shop All Tote Bags — Mazel Tote Collection',
  description: 'Browse our full collection of premium handcrafted tote bags. Vibrant sublimation prints, durable canvas, 100% of profits donated to charity. Find your perfect companion.',
};

async function getProducts() {
  try {
    const apiUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const res = await fetch(`${apiUrl}/api/products`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default async function Products() {
  const products = await getProducts();

  return <ProductsClient products={products} />;
}