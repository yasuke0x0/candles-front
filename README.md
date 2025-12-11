# 📦 Solo Fulfillment Workflow

## 🎯 The Strategy: "Batch, Pick, Scan"
**Goal:** Eliminate context switching. You do not want to run back and forth between the computer, the shelf, and the printer for every single order.

### 🛠 Prerequisites
* **Hardware:** 1 Laptop, 1 Barcode Scanner (USB/Bluetooth), 1 Thermal Label Printer (4x6).
* **Paperwork:** "Packing Slips" (A4/Letter paper) that include an **Order ID Barcode**.

---

## 1. Phase A: The "Morning Batch" (Digital Prep)
*Sit at the computer. Do this once per shipping session (e.g., 9:00 AM).*

1.  **Select Orders:** Select all pending orders in your system.
2.  **Run Algorithms:** Your backend runs `3d-bin-packing-ts` for all selected orders.
  * *Result:* The system now knows exactly which box size is required for every order.
3.  **Generate Documents:**
  * **Print 1 Master Pick List:** A summary of *all* items needed for this batch (e.g., "5x Red Candle", "3x Blue Candle").
  * **Print Individual Packing Slips:** One sheet per order.
    * **Must include:** Order ID Barcode, List of Items, and **Box Type** (e.g., "BOX A").

---

## 2. Phase B: The Run (Picking)
*Leave the desk. Do the physical labor all at once.*

1.  Take the **Master Pick List** and a bin/cart.
2.  Walk your storage area **once**.
3.  Grab every item on the list.
4.  Bring the bin full of products to your **Packing Station**.
5.  Place the stack of **Packing Slips** on the desk.

---

## 3. Phase C: The Station (Packing & Shipping)
*Stand at the packing table. This is the "Scan to Verify" loop.*

**The Setup:**
* **Left side:** Stack of Packing Slips.
* **Middle:** Your bin of loose products.
* **Right side:** Empty Boxes and Filler.
* **Front:** Scanner and Label Printer.

**The Loop (Repeat for each order):**

1.  **Grab** the top Packing Slip.
2.  **Read** the "Box Type" printed on it (calculated by your bin-packing logic). Grab that box.
3.  **Pick** the specific items for that order from your bin.
  * *(Safety Check: Scan the product barcodes if you want 100% accuracy, otherwise visually verify).*
4.  **Pack** the items into the box.
5.  **Scan** the **Order Barcode** on the Packing Slip.
  * *System Action:* Your app receives the scan -> Sends dimensions/weight to Shippo -> Buys Label -> Sends ZPL to Printer.
6.  **Label** prints instantly.
7.  **Stick** label on box. Seal it. Throw it in the "Done" pile.

---

## 💡 Why this works for 1 Person
1.  **Flow State:** You aren't switching between "Admin mode" (computer) and "Warehouse mode" (shelves). You do all the admin, then all the walking, then all the packing.
2.  **No Label Mix-ups:** By scanning the slip to print the label *just as you pack the box*, you never end up with a stack of 50 loose shipping labels wondering which one goes on which box.
3.  **Bin Packing Logic:** Since the box size is printed on the paper, you don't waste time testing different boxes. You trust the code.
