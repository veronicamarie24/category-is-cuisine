export interface InventoryItemPayload {
    item_name: string;
    category: string;
    quantity: string;
    unit_of_measurement: string;
    purchase_date: Date;
    expiration_date: Date;
    notes: string;
}

export interface InventoryItem {
    id: number;
    item_name: string;
    category: string;
    quantity: string;
    unit_of_measurement: string;
    purchase_date: Date;
    expiration_date: Date;
    notes: string;
}