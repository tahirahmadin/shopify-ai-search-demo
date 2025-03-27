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

    console.log("API Response:", response.data);

    let products = [];
    if (response.data) {
      if (Array.isArray(response.data)) {
        products = response.data;
      } else if (response.data.products) {
        products = response.data.products;
      } else if (typeof response.data === "object") {
        // Handle case where response might be a single product
        products = [response.data];
      }
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

export interface OrderAddress {
  first_name: string;
  last_name: string;
  address1: string;
  city: string;
  province: string;
  country: string;
  zip: string;
}

export interface OrderLineItem {
  variant_id: number;
  quantity: number;
}

export interface OrderCustomer {
  first_name: string;
  last_name: string;
  email: string;
}

export interface CreateOrderParams {
  email: string;
  line_items: OrderLineItem[];
  customer: OrderCustomer;
  billing_address: OrderAddress;
  shipping_address: OrderAddress;
}

export async function createOrder(orderData: CreateOrderParams) {
  try {
    const accessToken = import.meta.env.VITE_PUBLIC_SHOPIFY_KEY;
    console.log("Creating order with token:", accessToken);

    if (!accessToken) {
      throw new Error("Access token not found in environment variables");
    }

    const url = `https://aggregator.gobbl.ai/api/shopify/createOrder?accessToken=${accessToken}`;

    const orderPayload = {
      order: {
        ...orderData,
        fulfillment_status: "unfulfilled",
        send_receipt: true,
        send_fulfillment_receipt: true,
        financial_status: "paid",
      },
    };

    console.log("Sending order payload:", orderPayload);

    const response = await axios.post(url, orderPayload);
    console.log("Order creation response:", response.data);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    } else {
      console.error("Error creating order:", error);
    }
    throw error;
  }
}
