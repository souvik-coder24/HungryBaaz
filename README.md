![Logo](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/th5xamgrr6se0x5ro4g6.png)

<!-- # HungryBaaz -->

**HungryBaaz** is a modern web application designed to offer a seamless and engaging dining experience. With advanced features ranging from recipe generation to real-time data fetching and user-friendly design elements, HungryBaaz is tailored for desktop and tablet users seeking a dynamic restaurant menu experience.

## Overview

HungryBaaz integrates various advanced features to enhance user interaction with restaurant menus. This application includes:

- **Recipe Generation**: Generate recipes on-demand.
- **User Authentication**: Secure login and registration with Google integration.
- **Real-Time Data Fetching**: Up-to-date menu information from Swiggy.
- **Responsive Design**: Optimized for desktop and tablets.

## Features

### Recipe Generator

- **Feature**: Generate recipes on-demand with the click of a button using Gemini.
- **How to Access**: Click the **Get Recipe** button on the restaurant menu.
- **Additional Feature**: Copy the generated recipe to your clipboard.
- **Screenshot**:

  ![Recipe Generator](assets/images/recipe-generator.png)
  *Generate recipes easily with the Get Recipe button. Copy function included.*

### Impressive Design

- **Feature**: Modern, visually appealing design to enhance user experience.
- **Screenshot**:

  ![Impressive Design](src/assets/images/design.png)
  *The clean and elegant design of HungryBaaz.*

### User Authentication

- **Feature**: Secure login and registration system with Google integration.
- **Details**: After logging in with Google, the user's profile image replaces the default user icon. Clicking the icon opens a logout option.
- **Screenshot**:

  ![User Authentication](assets/images/user-authentication.png)
  *Google login and user profile image integration.*

### Real-Time Data Fetching

- **Feature**: Fetch real-time data from the Swiggy API to provide up-to-date menu information.
- **How to Access**: Data is automatically updated in the menu interface.
- **Screenshot**:

  ![Real-Time Data Fetching](assets/images/real-time-data.png)
  *Live updates from Swiggy API.*

### Location Change and Recent Searches

- **Feature**: Change location across India and view recent searches in the sidebar.
- **How to Access**: Click on the location change option in the header to open the sidebar, which shows recent searches (up to 3).
- **Screenshot**:

  ![Location and Recent Searches](assets/images/location-recent-searches.png)
  *Change location and view recent searches.*

### Search and Filter Functionality

- **Feature**: Search and filter menu items based on important criteria.
- **How to Access**: Use the search bar and filter options on the menu page.
- **Screenshot**:

  ![Search and Filter](assets/images/search-filter.png)
  *Search and filter options for a tailored menu experience.*

### Add-ons and Cart Functionality

- **Feature**: Add or remove add-ons for menu items, manage cart items, and enforce checkout requirements.
- **Details**: Users can only proceed to checkout if logged in and have added an address. Icons in the cart can be removed.
- **Screenshot**:

  ![Add-ons and Cart](assets/images/add-ons-cart.png)
  *Manage add-ons and cart items efficiently.*

### Responsive Design

- **Feature**: Fully responsive design for desktop and tablets.
- **Note**: The design is optimized for desktop and tablet devices; mobile screen support is limited due to API constraints.
- **Screenshot**:

  ![Responsive Design](assets/images/responsive-design.png)
  *Responsive design for desktop and tablets.*

## Installation

To set up HungryBaaz locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/souvik-coder24/HungryBaaz.git

2. **Install dependencies:**
   ```bash
   npm install

3. **Start the development server:**
   ```bash
   npm run dev

4. **Build the project for production (optional):**
   ```bash
   cd HungryBaaz

5. **Preview the production build (optional):**
   ```bash
   npm run preview

## Contributing

We welcome contributions to HungryBaaz. To contribute:

1. **Fork the repository on GitHub.**

2. **Create a new branch:**
   ```bash
   git checkout -b feature/your-feature-name

3. **Stages all changes for the next commit:**
   ```bash
   git Add

4. **Commits the staged changes with a message describing the changes:**
   ```bash
   git commit -m "Add your feature or fix description"

5. **Pushes the committed changes to a specific branch in the remote repository:**
   ```bash
   git push origin feature/your-feature-name

6. **Open a pull request on GitHub with a detailed description of your changes.**


