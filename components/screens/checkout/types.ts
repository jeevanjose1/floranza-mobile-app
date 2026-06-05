export type Address = {
  id: string;
  fullName: string;
  country: string;
  streetAddress: string;
  addressLine2: string;
  city: string;
  state: string;
  postcode: string;
  phone: string;
  email: string;
  shippingOption: string;
};

export type CartItem = {
  id: string | number;
  cart_id: string | number;
  slug: string;
  cart_qty: number;
  name: string;
  attributeOption?: string;
  price: number;
  image?: { mini: string };
};

export type PaymentMethod = "RAZORPAY" | "PHONEPE";

export type DeliveryPreferences = {
  courier: string;
  instructions: string;
};

export type DeliveryErrors = {
  courier?: string;
  instructions?: string;
};
