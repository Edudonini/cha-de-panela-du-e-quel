export type EventConfig = {
  id: string;
  event_title: string;
  couple_name: string;
  event_date: string | null;
  event_time: string | null;
  event_address_full: string | null;
  pix_receiver_name: string;
  pix_key: string;
  pix_qr_code_url: string | null;
  delivery_address_full: string;
  updated_at: string;
};

export type GuestRsvp = {
  id: string;
  guest_name: string;
  attending: boolean;
  companions_count: number;
  created_at: string;
};

export type GiftItem = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  store_url: string | null;
  category: string | null;
  price_suggested_cents: number;
  is_group_gift: boolean;
  goal_cents: number | null;
  status: "active" | "delivered" | "archived";
  created_at: string;
  updated_at: string;
};

export type GiftItemPublic = GiftItem & {
  contributed_cents: number;
  is_reserved: boolean;
};

export type GiftReservation = {
  id: string;
  item_id: string;
  guest_name: string;
  is_anonymous: boolean;
  status: "reserved" | "cancelled";
  created_at: string;
  updated_at: string;
};

export type GiftContribution = {
  id: string;
  item_id: string;
  guest_name: string;
  is_anonymous: boolean;
  amount_cents: number;
  created_at: string;
};
