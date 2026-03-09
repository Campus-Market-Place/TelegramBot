

  // src/services/mockData.service.ts
export async function getMockNotifications(telegramId: string) {
    // simulate backend delay
    await new Promise((res) => setTimeout(res, 300));
    return [
      "Order #123 has been shipped 🚚",
      "New product added to your shop 🛍",
      "Your appeal was approved ✅"
    ];
  }
  
  export async function getMockStatistics(telegramId: string) {
    await new Promise((res) => setTimeout(res, 300));
    return {
      productsSold: 50,
      totalRevenue: 200, // in USD
      activeListings: 10
    };
  }
  
 // src/services/mockData.service.ts
export async function getMockShopView(telegramId: string) {
    await new Promise((res) => setTimeout(res, 300));
  
    return [
      { name: "Mr. X checked your shop 🏪", time: "10:15 AM" },
      { name: "Ms. Y visited your shop 👀", time: "11:30 AM" },
      { name: "John Doe viewed your product 📦", time: "1:45 PM" },
      { name: "Alice checked your shop 🛍", time: "3:20 PM" },
      { name: "Bob visited your shop today 👁️", time: "5:00 PM" }
    ];
  }
  
  export async function getMockSupportFAQ() {
    await new Promise((res) => setTimeout(res, 200));
    return [
      "Q1: How to sell products?\nA1: Click 'Be seller' button",
      "Q2: How to withdraw money?\nA2: Go to Statistics -> Withdraw",
      "Q3: How to appeal?\nA3: Click 'Ask Appeal' button"
    ];
  }
  
  export async function getMockAskAppealResponse() {
    await new Promise((res) => setTimeout(res, 200));
    return "Your appeal was submitted successfully. Our team will review it soon.";
  }

  export async function getMockUserNotifications(telegramId: string) {
    await new Promise((res) => setTimeout(res, 200));
    return [
      "Welcome to Campus Marketplace! 👋",
      "New deals are available near your campus 🛍",
      "Your profile was viewed by 3 sellers today 👀"
    ];
  }

  export async function getMockUserInformation() {
    await new Promise((res) => setTimeout(res, 200));
    return [
      "Campus Marketplace is a platform for students to buy & sell products.",
      "You can browse products, check shop views, and contact sellers.",
      "Your activity is tracked and you receive notifications for updates."
    ];
  }