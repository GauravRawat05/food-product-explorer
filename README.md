# Food Product Explorer

A modern, responsive web application to explore food products using the OpenFoodFacts API. This project demonstrates React best practices, responsive UI design (Tailwind CSS), and efficient API integration.

## 🚀 Methodology

This project was built with a focus on **User Experience (UX)** and **Code Modularity**.

1.  **Component Architecture**: The app is split into reusable components (`ProductCard`, `Navbar`, `NutritionChart`) to ensure maintainability.
2.  **Custom Hooks**: Logic for data fetching (`useInfiniteScroll`) and state management (`useShop`) is abstracted into hooks/contexts to keep UI components clean.
3.  **Responsive Design**: A "Mobile-First" approach was used with Tailwind CSS to ensure seamless usage on all devices.
4.  **Performance**:
    - **Debounced Search**: To minimize API calls during typing.
    - **Infinite Scroll**: To handle large datasets efficiently without pagination clicks.
    - **Framer Motion**: For smooth, hardware-accelerated animations (sidebar, specific transitions).

## 🛠 Tech Stack

-   **Frontend**: React (Vite)
-   **Styling**: Tailwind CSS, Lucide React (Icons), Framer Motion (Animations)
-   **Routing**: React Router DOM
-   **State Management**: React Context API (Shopping Cart & Compare)

## ✨ Features

-   **Dynamic Search**: Search products by name (with debounce) or Barcode.
-   **Category Filtering**: Persistent "Rail" sidebar for easy filtering on Desktop; Horizontal scroll on Mobile.
-   **Sorting**: Sort by Name, Nutrition Grade, or Relevance.
-   **Infinite Scroll**: Automatically loads more products as you browse.
-   **Cart System**: Add items to a virtual pantry/cart.
-   **Product Details**: Deep dive into ingredients, nutrition radar charts, and additives.
-   **Barcode Support**: Direct lookup for specific products.

## ⏱ Time Taken

**Total Time**: Approximately 6 Hours
-   Planning & Setup: 1 Hour
-   Core Features (API, Search, List): 2.5 Hours
-   UI Polish & Responsive Fixes: 2 Hours
-   Documentation & Cleanup: 0.5 Hours

## 📦 How to Run

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open `http://localhost:5173` in your browser.

---
*Built for Assignment Submission - September 2024*
