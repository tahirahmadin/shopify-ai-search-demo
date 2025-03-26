import axios from "axios";

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string | null;
  price: string;
  spicinessLevel: number;
  sweetnessLevel: number;
  dietaryPreference: string[];
  healthinessScore: number;
  popularity: number;
  caffeineLevel: string;
  sufficientFor: number;
}

export async function getProducts(): Promise<Product[]> {
  try {
    const accessToken = import.meta.env.VITE_PUBLIC_SHOPIFY_KEY;
    console.log("Attempting to fetch products with token:", accessToken);

    if (!accessToken) {
      throw new Error("Access token not found in environment variables");
    }

    let url = `https://aggregator.gobbl.ai/api/shopify/getProducts?accessToken=${accessToken}`;
    const response = await axios.get(url);

    console.log("API Response:", response.data.result);

    let products = [];
    if (response.data.result) {
      products = response.data.result;
    }

    return products.map((item: any) => ({
      id: parseInt(item.id),
      name: item.title || "",
      description: item.body_html || "",
      category: item.product_type || null,
      price: item.variants?.[0]?.price || "0.00",
      image: {
        id: item.image?.id || null,
        src: item.image?.src || "",
        alt: item.image?.alt || "",
        width: item.image?.width || 0,
        height: item.image?.height || 0,
      },
      variants: (item.variants || []).map((variant: any) => ({
        id: parseInt(variant.id),
        title: variant.title,
        price: variant.price,
        position: variant.position,
      })),
      status: item.status || "active",
      vendor: item.vendor || "",
      tags: item.tags || "",
      published_at: item.published_at || null,
      created_at: item.created_at || null,
      updated_at: item.updated_at || null,
      // Adding default values for menu item specific fields
      spicinessLevel: 0,
      sweetnessLevel: 0,
      dietaryPreference: ["Vegetarian"],
      healthinessScore: 3,
      popularity: 4,
      caffeineLevel: "None",
      sufficientFor: 1,
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          headers: error.config?.headers,
          params: error.config?.params,
        },
      });
    } else {
      console.error("Error fetching products:", error);
    }
    // Return empty array instead of throwing to prevent app from breaking
    return [];
  }
}
